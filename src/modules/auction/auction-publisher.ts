import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import { bidRequestValidator } from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import { IBidAuction } from "../../middlewares/typings/middleware-types";
import eventService from "../../utils/event-service";
import {
    NODE_EVENT_SERVICE,
    MESSAGES,
    SOCKET_EVENT,
} from "../../common/constants";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import userQueries from "../users/user-queries";
import logger from "../../config/logger";

const socket = global as unknown as AppGlobal;
const countdowns: { [auctionId: string]: number } = {}; // Countdown collection
const BidBotCountDown: { [auctionId: string]: number } = {};
/**
 * Starts the auction with the given auctionId.
 * @param {string} auctionId - The ID of the auction to start.
 * @returns {void}
 */

export const auctionStart = (auctionId: string) => {
    countdowns[auctionId] = 10;
    /**
     * Timer function that runs every second during the auction.
     * @async
     * @returns {Promise<void>}
     */
    async function timerRunEverySecond() {
        if ((countdowns[auctionId] as number) <= 0) {
            delete countdowns[auctionId];
            const bidHistory = JSON.parse(
                (await redisClient.get(
                    `${auctionId}:bidHistory`
                )) as unknown as string
            );
            if (bidHistory) {
                const winnerPlayer = bidHistory[bidHistory.length - 1];
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_WINNER,
                    ...winnerPlayer,
                });
            } else {
                // TODO: Delete this code
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_ENDED,
                });
            }
            eventService.emit(NODE_EVENT_SERVICE.AUCTION_CLOSED, auctionId);
            eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE, {
                auctionId: auctionId,
                state: AUCTION_STATE.completed,
            });
            logger.log({
                level: "log",
                message: "auction ended" + auctionId,
            });
        } else {
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_COUNT_DOWN, {
                message: MESSAGES.SOCKET.AUCTION_COUNT_DOWN,
                count: countdowns[auctionId],
                auctionId,
            });
            logger.log({
                level: "log",
                message: "auction is running" + auctionId,
            });
            countdowns[auctionId] = (countdowns[auctionId] as number) - 1;
            eventService.emit(NODE_EVENT_SERVICE.SIMULATION_BOTS, {
                auction_id: auctionId,
                count: countdowns[auctionId],
            });
            eventService.emit(
                NODE_EVENT_SERVICE.COUNTDOWN,
                countdowns[auctionId],
                auctionId
            ); //emit live countdown
            setTimeout(timerRunEverySecond, 1000);
        }
    }
    timerRunEverySecond();
};

/**
 * fetch  and emits recent bid history for a given auction ID.
 * @param {string} auctionId - The ID of the auction to get recent bid history for.
 * @returns {Promise<void>} - A promise that resolves after emitting bid history to the socket.
 */
const recentBid = async (auctionId: string) => {
    const bidHistory = JSON.parse(
        (await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string
    );
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_RECENT_BID, {
        message: MESSAGES.SOCKET.AUCTION_RECENT_BID,
        data: bidHistory[bidHistory.length - 1],
        auctionId,
    });
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_BIDS, {
        message: MESSAGES.SOCKET.RECENT_BIDS,
        data: bidHistory.slice(-30).reverse(),
        auctionId,
    });
};

/**
 * @description - create a bid transaction if player wallet balance greater than auction consumed bid value othrewise return false
 * @param payload - payload containing player ID and socket Id and auction Id
 * @returns {Promise<void>}
 */
const bidTransaction = async (payload: {
    playerId: string;
    socketId: string;
    auctionId: string;
}) => {
    const isBalance = JSON.parse(
        (await redisClient.get("player:plays:balance")) as unknown as string
    );
    const auctionData = JSON.parse(
        (await redisClient.get(
            `auction:live:${payload.auctionId}`
        )) as unknown as string
    );
    if (
        auctionData &&
        isBalance &&
        +isBalance[payload.playerId] > auctionData?.plays_consumed_on_bid
    ) {
        const bidHistory = JSON.parse(
            (await redisClient.get(
                `${payload.auctionId}:bidHistory`
            )) as unknown as string
        );
        if (
            bidHistory &&
            bidHistory.length * auctionData.bid_increment_price +
                auctionData.opening_price >=
                auctionData.products.price
        ) {
            countdowns[`${payload.auctionId}`] = 0;
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.AUCTION_ENDED,
            });
        } else {
            const bidNumber = bidHistory ? bidHistory.length + 1 : 1;
            const bidPrice = bidHistory
                ? bidHistory.length * auctionData.bid_increment_price +
                  auctionData.opening_price +
                  auctionData.bid_increment_price
                : auctionData.bid_increment_price + auctionData.opening_price;
            socket.playerSocket
                .to(payload.socketId)
                .emit(SOCKET_EVENT.AUCTION_CURRENT_PLAYS, {
                    message: MESSAGES.SOCKET.CURRENT_PLAYS,
                    play_balance:
                        isBalance[payload.playerId] -
                        auctionData.plays_consumed_on_bid,
                });

            eventService.emit(NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_DEBIT, {
                player_id: payload.playerId,
                plays_balance: auctionData.plays_consumed_on_bid,
                auction_id: payload.auctionId,
            });
            return {
                status: true,
                bidNumber,
                bidPrice: parseFloat(bidPrice.toFixed(2)),
            };
        }
    }
    return { status: false };
};

const auctionBidderHistory = async (
    bidderPayload: IBidAuction,
    socketId: string,
    type: string,
    bidHistoryData: string
) => {
    const isBalance = await bidTransaction({
        playerId: bidderPayload.player_id,
        socketId,
        auctionId: bidderPayload.auction_id,
    });
    if (isBalance.status && countdowns[bidderPayload.auction_id]) {
        const newBidData = {
            ...bidderPayload,
            bid_price: isBalance.bidPrice,
            bid_number: isBalance.bidNumber,
        };
        countdowns[newBidData.auction_id] = 10;
        if (type === "new_bid_history_set") {
            await redisClient.set(
                `${newBidData.auction_id}:bidHistory`,
                JSON.stringify([{ ...newBidData, created_at: new Date() }])
            );
            recentBid(newBidData.auction_id);
        } else {
            const newbidHistory = JSON.parse(bidHistoryData);
            newbidHistory.push({ ...newBidData, created_at: new Date() });
            await redisClient.set(
                `${newBidData.auction_id}:bidHistory`,
                JSON.stringify(newbidHistory)
            );
            recentBid(newBidData.auction_id);
        }
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.INSUFFICIENT_PLAYS_BALANCED,
        });
    }
};

/**
 * Handles a new bid received for an auction.
 * @async
 * @param {IBidAuction} bidPayload - The bid data payload.
 * @param {string} socketId - The ID of the socket for sending the response.
 * @returns {Promise<void>}
 */
export const newBiDRecieved = async (
    bidPayload: IBidAuction,
    socketId: string
) => {
    const isValid = await bidRequestValidator<IBidAuction>(
        bidPayload,
        auctionSchemas.ZbidAuction
    );
    if (!isValid.status) {
        socket.playerSocket
            .to(socketId)
            .emit(SOCKET_EVENT.AUCTION_ERROR, { ...isValid });
    } else {
        const { bidData } = isValid;
        const isAuction = countdowns[bidData.auction_id];
        if (!isAuction) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.AUCTION_NOT_FOUND,
            });
        } else {
            const isPre_register = await redisClient.get(
                `auction:pre-register:${bidData.auction_id}`
            );
            if (isPre_register) {
                const preRegisterData = JSON.parse(isPre_register);
                if (
                    !preRegisterData[
                        `${bidData.auction_id + bidData.player_id}`
                    ]
                ) {
                    socket.playerSocket
                        .to(socketId)
                        .emit(SOCKET_EVENT.AUCTION_ERROR, {
                            message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
                        });
                } else {
                    const isBidHistory = await redisClient.get(
                        `${bidData.auction_id}:bidHistory`
                    );
                    const existingBotData = JSON.parse(
                        (await redisClient.get(
                            `BidBotCount:${bidPayload.auction_id}`
                        )) as string
                    );
                    if (existingBotData) {
                        if (existingBotData[`${bidPayload.player_id}`]) {
                            const player_bot =
                                existingBotData[`${bidPayload.player_id}`];
                            socket.playerSocket
                                .to(socketId)
                                .emit(SOCKET_EVENT.BIDBOT_STATUS, {
                                    message: player_bot.is_active
                                        ? MESSAGES.BIDBOT.BIDBOT_ACTIVE
                                        : MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                                    auction_id: player_bot.auction_id,
                                    player_id: player_bot.player_id,
                                    status: player_bot.is_active,
                                });
                        } else {
                            socket.playerSocket
                                .to(socketId)
                                .emit(SOCKET_EVENT.BIDBOT_STATUS, {
                                    message: MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                                    auction_id: bidPayload.auction_id,
                                    player_id: bidPayload.player_id,
                                    status: false,
                                });
                        }
                    }

                    if (!isBidHistory) {
                        auctionBidderHistory(
                            bidData,
                            socketId,
                            "new_bid_history_set",
                            ""
                        );
                    } else {
                        const iscontinue = JSON.parse(isBidHistory);
                        if (
                            iscontinue[iscontinue.length - 1].player_id ===
                            bidData.player_id
                        ) {
                            socket.playerSocket
                                .to(socketId)
                                .emit(SOCKET_EVENT.AUCTION_ERROR, {
                                    message:
                                        MESSAGES.SOCKET
                                            .CONTINUE_BID_NOT_ALLOWED,
                                });
                        } else {
                            auctionBidderHistory(
                                bidData,
                                socketId,
                                "new_bid_history_update",
                                isBidHistory
                            );
                        }
                    }
                }
            } else {
                socket.playerSocket
                    .to(socketId)
                    .emit(SOCKET_EVENT.AUCTION_ERROR, {
                        message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
                        data: bidPayload.player_id,
                    });
            }
        }
    }
};

/**
 * @description create the random bid for the simulations
 * @param {string} auction_id
 * @param {number} count
 */
export const randomBid = async (auction_id: string, count: number) => {
    if (!BidBotCountDown[auction_id]) {
        BidBotCountDown[auction_id] = Math.floor(Math.random() * (10 - 6)) + 3;
    }
    if (BidBotCountDown[auction_id] === count && count > 1) {
        const usersbots = await userQueries.getRandomBot();
        if (!usersbots) return;
        const randomIndex = Math.floor(Math.random() * (usersbots.length - 1));
        let bot = usersbots[randomIndex];
        const isContinueBids = JSON.parse(
            (await redisClient.get(`${auction_id}:bidHistory`)) as string
        );
        if (isContinueBids?.length) {
            const lastBids = isContinueBids[isContinueBids.length - 1];
            if (lastBids.player_id === bot?.id) {
                const isFilteredBots = usersbots.filter(
                    (bot) => bot.id !== lastBids.player_id
                );
                const randomIndex = Math.floor(
                    Math.random() * (usersbots.length - 1)
                );
                bot = isFilteredBots[randomIndex];
            }
        }
        if (bot && count > 0) {
            const botData: IBidAuction = {
                auction_id: auction_id,
                player_id: bot.id,
                player_name: bot.first_name as unknown as string,
                profile_image: bot.avatar as unknown as string,
                remaining_seconds: count,
            };
            await newBiDRecieved(botData, bot.id);
        }
        BidBotCountDown[auction_id] = Math.floor(Math.random() * (10 - 6)) + 3;
    }
};
