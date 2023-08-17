import { EventEmitter } from "events";
import { auctionState } from "@prisma/client";
import { mailService } from "./mail-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import { Imail } from "./typing/utils-types";
import {
    TEMPLATE,
    NODE_EVENT_SERVICE,
    SOCKET_EVENT,
    MESSAGES,
} from "../common/constants";
import { Ispend_on } from "../modules/users/typings/user-types";
import redisClient from "../config/redis";
import userQueries from "../modules/users/user-queries";
import { AppGlobal } from "./socket-service";
import { PrismaClient } from "@prisma/client";

import { prismaTransaction } from "./prisma-transactions";
import productQueries from "../modules/product/product-queries";
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

                const mailData = {
                    email: userEmail,
                    template: TEMPLATE.PLAYER_REGISTERATION,
                    subject: "Reminder for Auction start",
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
                        subject: "Auction cancelled",
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
    async (auction_id: string) => {
        await auctionQueries.updatePlayerRegistrationAuctionStatus(
            auction_id,
            "live"
        );
    }
);

/**
 * Registers a callback function for the 'AUCTION_CLOSED' event.
 * @param {string} auctionId - The ID of the closed auction associated with the event.
 * @returns {void}
 */
eventService.on(
    NODE_EVENT_SERVICE.AUCTION_CLOSED,
    async (auctionId: string) => {
        const auctionBidLog = await redisClient.get(`${auctionId}:bidHistory`);
        if (auctionBidLog) {
            const winnerePayload = JSON.parse(auctionBidLog);
            await userQueries.playerBidLog(winnerePayload);
            const newWinnerPayload = winnerePayload[winnerePayload.length - 1];
            await auctionQueries.updatePlayerRegistrationAuctionResultStatus(
                auctionId,
                newWinnerPayload.player_id
            );
        }else{
            await auctionQueries.updateRegistrationAuctionStatus(
                auctionId,
            );
        }
    }
);

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
    const playersBalance = JSON.parse((await redisClient.get("player:plays:balance")) as unknown as string);
    const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${data.auction_id}`) as string);
        
    if (playersBalance) {
        if (playersBalance[data.player_id]) {
            playersBalance[data.player_id] =
                +playersBalance[data.player_id] - data.plays_balance;
            await redisClient.set("player:plays:balance",JSON.stringify(playersBalance));
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
        const updatedLimit = Number(existingBotData?.[data.player_id]?.plays - data.plays_balance);
        if (existingBotData[data.player_id]) {
            existingBotData[data.player_id].plays = updatedLimit;
            existingBotData[data.player_id].total_bot_bid = Number(existingBotData[data.player_id].total_bot_bid) + 1;
            if (!updatedLimit) {
                existingBotData[data.player_id].is_active = false;
                socket.playerSocket.to(existingBotData[data.player_id].socket_id).emit(SOCKET_EVENT.BIDBOT_ERROR, {message: "plays limit reached"});
                socket.playerSocket.to(existingBotData[data.player_id].socket_id).emit(SOCKET_EVENT.BIDBOT_STATUS, { message: `bidbot not active:${existingBotData[data.player_id].auction_id}:${existingBotData[data.player_id].player_id}`});
            }
            await redisClient.set(`BidBotCount:${data.auction_id}`, JSON.stringify(existingBotData));
        }
    }
    }
);

export default eventService;
