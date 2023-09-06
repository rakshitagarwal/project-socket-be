import { EventEmitter } from "events";
import { auctionState } from "@prisma/client";
import { mailService } from "./mail-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import {
    TEMPLATE,
    NODE_EVENT_SERVICE,
    SOCKET_EVENT,
    MESSAGES,
    dateFormateForMail,
} from "../common/constants";
import { Ispend_on } from "../modules/users/typings/user-types";
import redisClient from "../config/redis";
import userQueries from "../modules/users/user-queries";
import { AppGlobal } from "./socket-service";
import { PrismaClient } from "@prisma/client";

import { prismaTransaction } from "./prisma-transactions";
import productQueries from "../modules/product/product-queries";
import {
    IRegisterPlayer,
    IStartSimulation,
} from "../modules/auction/typings/auction-types";
import { faker } from "@faker-js/faker";
import logger from "../config/logger";
import { Imail } from "./typing/utils-types";
import { randomBid } from "../modules/auction/auction-publisher";
import { db } from "../config/db";
import { setBotReferralCode } from "../common/helper";
const eventService: EventEmitter = new EventEmitter();
const socket = global as unknown as AppGlobal;

/**
 * @description - this event use for sending email notifications
 */
eventService.on(NODE_EVENT_SERVICE.USER_MAIL, async function (data: Imail) {
    await mailService(data);
});

/**
 * Event handler function that sends auction reminder or cancellation emails to registered players.
 *
 * @param {Object} data - The event data containing auctionId and status.
 * @param {string} data.auctionId - The ID of the auction.
 * @param {string} data.status - The status of the auction.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
eventService.on(
    NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL,
    async function (data: {
        auctionId: string;
        status: string;
        start_date: string;
    }) {
        const playerInformation =
            await auctionQueries.playerRegistrationAuction(data.auctionId);
        if (playerInformation.length) {
            const auctionInfo = playerInformation[0];
            if (data.status === "auction_start") {
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_START_DATE, {
                    message: "Auction start",
                    data: {
                        auction_id: data.auctionId,
                        start_date: data.start_date,
                    },
                });
                const userEmail = playerInformation.map((player) => {
                    return player.User.email;
                });
                /**
                 * Data object for sending a player registration reminder email.
                 *
                 * @typedef {Object} ReminderEmailData
                 * @property {string} email - The email address of the recipient.
                 * @property {string} template - The template to use for the email content.
                 * @property {string} subject - The subject of the email.
                 * @property {string} message - The message content of the email.
                 */
                const newDate = dateFormateForMail(data.start_date);
                const mailData = {
                    email: userEmail,
                    template: TEMPLATE.PLAYER_REGISTERATION,
                    subject: `Your Auction starts In ${newDate.hours}h ${newDate.minutes}m ${newDate.seconds}ss`,
                    message: `We are thrilled to remind you that the ${auctionInfo?.Auctions?.title} is just around the corner! The auction will go live on ${data.start_date}. Prepare for an exciting event with extraordinary items up for bid. Mark your calendar and be part of this unforgettable experience!`,
                };
                await mailService(mailData);
            } else if (data.status === "cancelled") {
                await prismaTransaction(async (prisma: PrismaClient) => {
                    const preRegisterRefund: Array<{
                        created_by: string;
                        play_credit: number;
                        spend_on: Ispend_on;
                        auction_id: string;
                    }> = [];
                    const userEmail = playerInformation.map((player) => {
                        preRegisterRefund.push({
                            created_by: player.player_id,
                            play_credit: player.Auctions
                                ?.registeration_fees as number,
                            spend_on: Ispend_on.REFUND_PLAYS,
                            auction_id: data.auctionId,
                        });
                        return player.User.email;
                    });
                    /**
                     * Data object for sending an auction cancellation email.
                     *
                     * @typedef {Object} CancellationEmailData
                     * @property {string} email - The email address of the recipient.
                     * @property {string} template - The template to use for the email content.
                     * @property {string} subject - The subject of the email.
                     * @property {string} message - The message content of the email.
                     */

                    const mailData = {
                        email: userEmail,
                        template: TEMPLATE.PLAYER_REGISTERATION,
                        subject: `Auction Cancelled : ${auctionInfo?.Auctions?.title}`,
                        message: `${auctionInfo?.Auctions?.title} has been cancelled and your ${preRegisterRefund[0]?.play_credit} plays have refunded `,
                    };
                    await mailService(mailData);
                    await prisma.playerWalletTransaction.createMany({
                        data: preRegisterRefund,
                    });
                });
            }
        }
    }
);

/**
 * Event handler function that updates the state of an auction in the database.
 * @param {Object} data - The event data containing auctionId and state.
 * @param {string} data.auctionId - The ID of the auction to update.
 * @param {string} data.state - The new state to set for the auction.
 * @returns {Promise<void>} - A promise that resolves when the auction state is updated successfully.
 */
eventService.on(
    NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE,
    async function (data: { auctionId: string; state: auctionState }) {
        await auctionQueries.updateAuctionState(data.auctionId, data.state);
    }
);

/**
 * Updates the registration status of a player for the specified auction to 'live'.
 * @param {string} auctionId - The ID of the auction.
 * @param {string} status - The status to set for the player's registration (e.g., 'live').
 * @returns {Promise<void>}
 */
eventService.on(
    NODE_EVENT_SERVICE.UPDATE_PLAYER_REGISTER_STATUS,
    async (auction_id: string, upcomingInfo: string) => {
        await auctionQueries.updatePlayerRegistrationAuctionStatus(
            auction_id,
            "live"
        );
        await redisClient.set(`auction:live:${auction_id}`, upcomingInfo);
    }
);

/**
 * Registers a callback function for the 'AUCTION_CLOSED' event.
 * @param {string} auctionId - The ID of the closed auction associated with the event.
 * @returns {void}
 */

export const auctionClosed = async (auctionId: string) => {
    logger.log({
        level: "warn",
        message: "auction event is close and " + auctionId,
    });
    const auctionBidLog = await redisClient.get(`${auctionId}:bidHistory`);
    if (auctionBidLog) {
        const winnerePayload = JSON.parse(auctionBidLog);
        const newWinnerPayload = winnerePayload[winnerePayload.length - 1];
        const bitLog = await Promise.all([
            await userQueries.playerBidLog(winnerePayload),
            await auctionQueries.updatePlayerRegistrationAuctionResultStatus(
                auctionId,
                newWinnerPayload.player_id
            ),
        ]);
        logger.log({
            level: "warn",
            message: "bidlogs for the auctions are:- " + auctionId,
        });
        if (bitLog) {
            await redisClient.del(`${auctionId}:bidHistory`);
        }
    } else {
        await auctionQueries.updateRegistrationAuctionStatus(auctionId);
    }
    await redisClient.del(`auction:live:${auctionId}`);
    await redisClient.del(`auction:pre-register:${auctionId}`);
    logger.log({
        level: "warn",
        message: "live auctio status closed" + auctionId,
    });
};

/**
 * Handles the logic to emit the total auction registration count and percentage.
 * @param {Object} data - The data object containing information about the auction registration count.
 * @param {string} data.auctionId - The ID of the auction.
 * @param {number} data.registeration_count - The total count of registrations for the auction.
 * @returns {void}
 */
eventService.on(
    NODE_EVENT_SERVICE.AUCTION_REGISTER_COUNT,
    async (data: { auctionId: string; registeration_count: number }) => {
        const auctionData = await auctionQueries.auctionRegistrationCount(
            data.auctionId
        );
        socket.playerSocket.emit(SOCKET_EVENT.AUCTION_REGISTER_COUNT, {
            message: MESSAGES.SOCKET.TOTAL_AUCTION_REGISTERED,
            data: {
                auction_registration_percentage:
                    (auctionData * 100) / data.registeration_count,
                auctionId: data.auctionId,
            },
        });
    }
);

/**
 * Handles the logic to delete product media images based on their IDs.
 * @param {string[]} productMediaIds - An array of IDs of product media images to be deleted.
 * @returns {void}
 */
eventService.on(
    NODE_EVENT_SERVICE.DELETE_PRODUCT_MEDIA_IMAGES,
    async (productMediaIds: string[]) => {
        await productQueries.updateProductMedia(productMediaIds);
    }
);

/**
 * Registers a callback function for the 'PLAYER_PLAYS_BALANCE_CREDITED' event.
 * @param {Object} data - The data object containing information about the player's plays balance credited.
 * @param {string} data.player_id - The ID of the player associated with the event.
 * @param {number} data.plays_balance - The amount of plays balance credited to the player.
 * @returns {void}
 */
eventService.on(
    NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_CREDITED,
    async (data: { player_id: string; plays_balance: number }) => {
        const playersBalance = JSON.parse(
            (await redisClient.get("player:plays:balance")) as unknown as string
        );
        if (!playersBalance) {
            await redisClient.set(
                "player:plays:balance",
                JSON.stringify({ [data.player_id]: data.plays_balance })
            );
        } else {
            if (playersBalance[data.player_id]) {
                playersBalance[data.player_id] =
                    +playersBalance[data.player_id] + +data.plays_balance;
                redisClient.set(
                    "player:plays:balance",
                    JSON.stringify(playersBalance)
                );
            } else {
                playersBalance[data.player_id] = data.plays_balance;
                redisClient.set(
                    "player:plays:balance",
                    JSON.stringify(playersBalance)
                );
            }
        }
    }
);

/**
 * Registers a callback function for the 'PLAYER_PLAYS_BALANCE_DEBIT' event.
 * @param {Object} data - The data object containing information about the player's plays balance debit.
 * @param {string} data.player_id - The ID of the player associated with the event.
 * @param {number} data.plays_balance - The amount of plays balance debited from the player.
 * @param {string} data.auction_id - The ID of the auction associated with the event.
 * @returns {void}
 */
eventService.on(
    NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_DEBIT,
    async (data: {
        player_id: string;
        plays_balance: number;
        auction_id: string;
    }) => {
        const playersBalance = JSON.parse(
            (await redisClient.get("player:plays:balance")) as unknown as string
        );
        const existingBotData = JSON.parse(
            (await redisClient.get(`BidBotCount:${data.auction_id}`)) as string
        );

        if (playersBalance) {
            if (playersBalance[data.player_id]) {
                playersBalance[data.player_id] =
                    +playersBalance[data.player_id] - data.plays_balance;
                await redisClient.set(
                    "player:plays:balance",
                    JSON.stringify(playersBalance)
                );
            }

            if (data.auction_id) {
                await userQueries.createBidtransaction({
                    player_id: data.player_id,
                    plays: data.plays_balance,
                    auction_id: data.auction_id,
                });
            }
        }

        if (existingBotData) {
            const updatedLimit = Number(
                existingBotData?.[data.player_id]?.plays - data.plays_balance
            );
            if (existingBotData[data.player_id]) {
                existingBotData[data.player_id].plays = updatedLimit;
                existingBotData[data.player_id].total_bot_bid =
                    Number(existingBotData[data.player_id].total_bot_bid) + 1;
                if (!updatedLimit) {
                    existingBotData[data.player_id].is_active = false;
                    socket.playerSocket
                        .to(existingBotData[data.player_id].socket_id)
                        .emit(SOCKET_EVENT.BIDBOT_ERROR, {
                            message: "plays limit reached",
                        });
                    socket.playerSocket
                        .to(existingBotData[data.player_id].socket_id)
                        .emit(SOCKET_EVENT.BIDBOT_STATUS, {
                            message: "bidbot not active",
                            auction_id:
                                existingBotData[data.player_id].auction_id,
                            player_id:
                                existingBotData[data.player_id].player_id,
                        });
                }
                await redisClient.set(
                    `BidBotCount:${data.auction_id}`,
                    JSON.stringify(existingBotData)
                );
            }
        }
    }
);

/**
 * @param details - array of object with play_credit, created_by
 * @description - implementing the multiple updates in the redis client of players play balances
 */
eventService.on(
    NODE_EVENT_SERVICE.MULTIPLE_PLAYER_PLAY_BALANCE_CREDIED,
    async (
        details: {
            play_credit: number;
            created_by: string;
        }[],
        auctionId: string
    ) => {
        const playerPlaysBalance: { [player_id: string]: number } = {};
        const userDetails = details.map((udx) => {
            playerPlaysBalance[udx.created_by] = udx.play_credit;
            return {
                [udx.created_by]: udx.play_credit,
            };
        });
        const playersBalance = JSON.parse(
            (await redisClient.get("player:plays:balance")) as unknown as string
        );
        if (!playersBalance) {
            await redisClient.set(
                "player:plays:balance",
                JSON.stringify({ ...playerPlaysBalance })
            );
        } else {
            await redisClient.set(
                "player:plays:balance",
                JSON.stringify({ ...playerPlaysBalance, ...playersBalance })
            );
        }

        const playerBlxInfo = JSON.parse(
            (await redisClient.get("player:plays:balance")) as unknown as string
        );
        const newRedisObject: { [id: string]: IRegisterPlayer } = {};
        const getRegisteredPlayer =
            JSON.parse(
                (await redisClient.get(
                    `auction:pre-register:${auctionId}`
                )) as string
            ) || {};
        await Promise.all([
            userDetails.map(async (udx) => {
                const key = Object.entries(udx);
                const transaction = await prismaTransaction(
                    async (prisma: PrismaClient) => {
                        const walletTrx = await userQueries.createTrx(
                            prisma,
                            `${key[0]?.[0]}`,
                            150
                        );
                        return { walletTrx };
                    }
                );
                if (playerBlxInfo) {
                    if (playerBlxInfo[`${key[0]?.[0]}`]) {
                        playerBlxInfo[`${key[0]?.[0]}`] =
                            playerBlxInfo[`${key[0]?.[0]}`] - 150;
                        await redisClient.set(
                            "player:plays:balance",
                            JSON.stringify({ ...playerBlxInfo })
                        );
                    }
                }

                await auctionQueries.playerAuctionRegistered({
                    auction_id: auctionId,
                    player_id: `${key[0]?.[0]}`,
                    player_wallet_transaction_id: transaction.walletTrx.id,
                });

                newRedisObject[auctionId + `${key[0]?.[0]}`] = {
                    created_at: transaction.walletTrx.created_at,
                    auction_id: auctionId,
                    player_id: `${key[0]?.[0]}`,
                    player_wallet_transaction_id: transaction.walletTrx.id,
                    id: "",
                };
                await redisClient.set(
                    `auction:pre-register:${auctionId}`,
                    JSON.stringify({
                        ...newRedisObject,
                        ...getRegisteredPlayer,
                    })
                );
            }),
        ]);
    }
);

eventService.on(
    NODE_EVENT_SERVICE.START_SIMULATION_LIVE_AUCTION,
    async (data: IStartSimulation) => {
        const roles = await userQueries.getPlayerRoleId();
        const users = faker.helpers.multiple(
            () => {
                return {
                    first_name: faker.internet.displayName(),
                    last_name: faker.internet.userName(),
                    email: faker.internet.email(),
                    password:
                        "$2b$10$IR35ignf5e9DJuRQkrYhP.okwg0nOC1sUgzL3reshqQ4QUeemcPB6",
                    country: "Australia",
                    is_bot: true,
                    is_verified: true,
                    referral_code: setBotReferralCode(),
                    avatar: `assets/avatar/${
                        faker.internet.userName().length
                    }.png`,
                };
            },
            {
                count: data.user_count,
            }
        );
        const updateUsers = users.map((user) => {
            return {
                ...user,
                role_id: roles?.id as unknown as string,
            };
        });
        const createdBots = await userQueries.createMultipleUsers(updateUsers);
        if (createdBots.count > 0) {
            const emails = updateUsers.map((user) => {
                return user.email;
            });
            const addPlaysInPlayBlx = await userQueries.addMultiplePlayBlx(
                emails,
                data.credit_plays
            );
            if (addPlaysInPlayBlx.queries.count > 0) {
                eventService.emit(
                    NODE_EVENT_SERVICE.MULTIPLE_PLAYER_PLAY_BALANCE_CREDIED,
                    addPlaysInPlayBlx.details,
                    data.auction_id
                );
                logger.info({
                    level: "warn",
                    message: "Random User Created in database",
                });
            }
        } else {
            logger.error({
                message: "something went wrong for creating the random bots",
            });
        }
    }
);

eventService.on(
    NODE_EVENT_SERVICE.SIMULATION_BOTS,
    async (data: { auction_id: string; count: number }) => {
        await randomBid(data.auction_id, data.count);
    }
);

eventService.on(
    NODE_EVENT_SERVICE.STOP_BOT_SIMULATIONS,
    async (ids: string[]) => {
        await Promise.all([
            db.user.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                    is_bot: true,
                },
                data: {
                    is_deleted: true,
                    status: false,
                },
            }),
        ]);
    }
);

eventService.on(
    NODE_EVENT_SERVICE.PLAYER_AUCTION_REGISTER_MAIL,
    async (payload: {
        user_name: string;
        auctionName: string;
        email: string;
        registeration_count: number;
        _count: number;
    }) => {
        await mailService({
            user_name: payload.user_name,
            email: [payload.email],
            subject: "You are Registered for the Auction!",
            template: TEMPLATE.PLAYER_AUCTION_REGISTER,
            message: payload.auctionName,
        });
        if (payload._count === payload.registeration_count) {
            const adminInfo = await userQueries.fetchAdminInfo();
            await mailService({
                user_name: `${adminInfo?.first_name}`,
                email: [adminInfo?.email || ""],
                subject: "Registration Player On Auction",
                template: TEMPLATE.REGISTER_PRE_ADMIN,
                message: `${payload.auctionName} have surged by an outstanding 100%`,
            });
        }
        if (
            payload._count %
                Math.ceil((payload.registeration_count * 10) / 100) ===
            0
        ) {
            const adminInfo = await userQueries.fetchAdminInfo();
            await mailService({
                user_name: `${adminInfo?.first_name}`,
                email: [adminInfo?.email || ""],
                subject: "Registration Player On Auction",
                template: TEMPLATE.REGISTER_PRE_ADMIN,
                message: `${payload.auctionName} have surged by an outstanding ${Math.ceil(payload._count*100/payload.registeration_count)}%`,
            });
        }
    }
);

export default eventService;
