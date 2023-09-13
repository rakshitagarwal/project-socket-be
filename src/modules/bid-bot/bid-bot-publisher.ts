import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import {
    AUCTION_MESSAGES,
    MESSAGES,
    NODE_EVENT_SERVICE,
    SOCKET_EVENT,
} from "../../common/constants";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData } from "./typings/bid-bot-types";
import { newBiDRecieved } from "../auction/auction-publisher";
import seedrandom from "seedrandom";
import logger from "../../config/logger";
import eventService from "../../utils/event-service";
import { auctionQueries } from "../auction/auction-queries";
const socket = global as unknown as AppGlobal;
const tempStorage: { [auctionId: string]: number } = {}; // to store random time

/**
 * @description Handles generating and storing a random time for a specific auction.
 * @param {string} auctionId - The ID of the auction.
 */
const randomTime = (auctionId: string) => {
    const random = seedrandom();
    const randomTime: number = Math.floor(+random() * 5) + 1;
    tempStorage[`${auctionId}`] = randomTime;
};

/**
 * @description Filters the bid bot collection based on certain criteria.
 * @param {string[]} bidBotCollection - Collection of player IDs for bidbot.
 * @param {string} lastBidderId - ID of the last bidder.
 * @param {number} lastBidPrice - Last bid price.
 * @param {Object} existingBotData - Existing bid bot data.
 * @param {string} auctionId - ID of the auction.
 * @returns {Promise<string[]>} - Filtered list of player IDs.
 */
async function filterBotCollection(
    bidBotCollection: string[],
    lastBidderId: string,
    lastBidPrice: number,
    existingBotData: {
        [playerId: string]: {
            plays: number;
            is_active: boolean;
            price_limit: number | undefined;
            auction_id: string;
            player_id: string;
            socket_id: string;
        };
    },
    auctionId: string
): Promise<string[]> {
    const filteredPlayerIds: string[] = await bidBotCollection.reduce(
        async (promise: Promise<string[]>, playerId: string) => {
            const filteredIds = await promise;
            const playerinfo = existingBotData[playerId];
            if (
                playerId !== lastBidderId &&
                playerinfo &&
                playerinfo.plays > 0 &&
                playerinfo.is_active
            ) {
                const playerPriceLimit = playerinfo.price_limit;
                if (playerPriceLimit && lastBidPrice >= playerPriceLimit) {
                    const bidBotInfo = JSON.parse(
                        (await redisClient.get(
                            `BidBotCount:${auctionId}`
                        )) as string
                    );
                    bidBotInfo[playerId].is_active = false;
                    socket.playerSocket
                        .to(playerinfo.socket_id)
                        .emit(SOCKET_EVENT.BIDBOT_STATUS, {
                            message: MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                            auction_id: playerinfo.auction_id,
                            player_id: playerinfo.player_id,
                        });

                    await redisClient.set(
                        `BidBotCount:${bidBotInfo[playerId].auction_id}`,
                        JSON.stringify(bidBotInfo)
                    );
                } else {
                    filteredIds.push(playerId);
                }
            }
            return filteredIds;
        },
        Promise.resolve([])
    );
    return filteredPlayerIds;
}

/**
 * @description event that catches live countdown and trigger bid bot execution.
 * @param {event name} countdown - live contdown is emitted from socket to countdown event.
 * @param {listener} anonymous_function - countdown and auction id is passed as listener.
 */
eventService.on(
    NODE_EVENT_SERVICE.COUNTDOWN,
    async function (countdown: number, auctionId: string) {
        if (!tempStorage[`${auctionId}`]) {
            randomTime(auctionId);
        }

        if (tempStorage[auctionId] && tempStorage[auctionId] === countdown) {
            const existingBotData = JSON.parse(
                (await redisClient.get(`BidBotCount:${auctionId}`)) as string
            );
            if (existingBotData) {
                const bidBotCollection = Object.keys(existingBotData);
                const bidHistory = JSON.parse(
                    (await redisClient.get(`${auctionId}:bidHistory`)) as string
                );
                let selectRandom;
                if (bidHistory) {
                    const lastBidder = bidHistory[bidHistory.length - 1];
                    const filteredBotCollection = await filterBotCollection(
                        bidBotCollection,
                        lastBidder.player_id,
                        lastBidder.bid_price,
                        existingBotData,
                        auctionId
                    );
                    const randomIndex = Math.floor(
                        Math.random() * filteredBotCollection.length
                    );
                    selectRandom = filteredBotCollection[randomIndex];
                } else {
                    const randomIndex = Math.floor(
                        Math.random() * bidBotCollection.length
                    );
                    selectRandom = bidBotCollection[randomIndex];
                }
                const randomBot = existingBotData[`${selectRandom}`];
                if (randomBot) {
                    await newBiDRecieved(
                        {
                            player_id: randomBot.player_id,
                            auction_id: randomBot.auction_id,
                            player_name: randomBot.player_name as string,
                            profile_image: randomBot.profile_image as string,
                            remaining_seconds: countdown,
                        },
                        randomBot.socket_id as string
                    );
                }
                randomTime(auctionId);
            } else {
                return;
            }
        }

        if (!countdown) {
            const existingBotData = JSON.parse(
                (await redisClient.get(`BidBotCount:${auctionId}`)) as string
            );
            if (!existingBotData) {
                logger.error(
                    MESSAGES.BIDBOT.BIDBOT_DATA_EMPTY + `: ${auctionId}`
                );
            } else {
                const bidBotCollection: IBidBotData[] =
                    Object.values(existingBotData);
                const arr: IBidBotData[] = [];
                bidBotCollection.map((items) => {
                    const {
                        player_id,
                        auction_id,
                        plays_limit,
                        price_limit,
                        total_bot_bid,
                    } = items;
                    arr.push({
                        player_id,
                        auction_id,
                        plays_limit,
                        price_limit,
                        total_bot_bid,
                        is_active: false,
                    });
                });
                await Promise.all([
                    bidBotQueries.addBidBotMany(arr as IBidBotData[]),
                    redisClient.del(`BidBotCount:${auctionId}`),
                ]);
                delete tempStorage[auctionId];
            }
        }
    }
);

/**
 * @description Handles the bid received from a bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const bidByBotRecieved = async (
    botData: IBidBotData,
    socketId: string
) => {
    const auctionData = await auctionQueries.getActiveAuctioById(
        botData.auction_id
    );
    if (auctionData?.state === "live") {
        if (!botData.plays_limit) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BITBOT_PLAYS_REQUIRED,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
            });
            return;
        }
        if (botData.plays_limit < 1) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BIDBOT_PLAYS_NEGATIVE,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
            });
            return;
        }
        if ((botData?.price_limit as number) < 0.0) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BIDBOT_PRICE_NEGATIVE,
            });
            return;
        }
        if (botData.price_limit) {
            const bidPrices = JSON.parse(
                (await redisClient.get(
                    `${botData.auction_id}:bidHistory`
                )) as string
            );
            if (
                bidPrices &&
                bidPrices.slice(-1).bid_price >= botData.price_limit
            ) {
                socket.playerSocket
                    .to(socketId)
                    .emit(SOCKET_EVENT.BIDBOT_ERROR, {
                        message: MESSAGES.BIDBOT.BIDBOT_PRICE_REACHED,
                    });
                return;
            }
            if (botData.price_limit >= auctionData.products.price) {
                socket.playerSocket
                    .to(socketId)
                    .emit(SOCKET_EVENT.BIDBOT_ERROR, {
                        message: MESSAGES.BIDBOT.BIDBOT_PRICE_GREATER,
                    });
                return;
            }
        }
        const wallet = (await userQueries.playerPlaysBalance(
            botData.player_id
        )) as unknown as [{ play_balance: number }];
        if (
            (wallet[0]?.play_balance as number) < botData.plays_limit ||
            !wallet.length
        ) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BIDBOT_WALLET_INSUFFICIENT,
            });
            return;
        }

        const bidByBotInfo = {
            ...botData,
            socket_id: socketId,
            total_bot_bid: 0,
            is_active: true,
            plays: botData.plays_limit,
        };
        const existingBotData = JSON.parse(
            (await redisClient.get(
                `BidBotCount:${botData.auction_id}`
            )) as string
        );

        if (!existingBotData) {
            await redisClient.set(
                `BidBotCount:${botData.auction_id}`,
                JSON.stringify({ [botData.player_id]: bidByBotInfo })
            );
        } else if (!existingBotData[botData.player_id]) {
            existingBotData[botData.player_id] = bidByBotInfo;
            await redisClient.set(
                `BidBotCount:${botData.auction_id}`,
                JSON.stringify(existingBotData)
            );
        } else if (existingBotData[botData.player_id]) {
            if (existingBotData[botData.player_id].is_active) {
                socket.playerSocket
                    .to(socketId)
                    .emit(SOCKET_EVENT.BIDBOT_ERROR, {
                        message: MESSAGES.BIDBOT.BIDBOT_ALREADY_ACTIVE,
                        auction_id: botData.auction_id,
                        player_id: botData.player_id,
                    });
                return;
            }
            existingBotData[botData.player_id] = {
                ...botData,
                is_active: true,
                plays_limit: botData.plays_limit,
                plays: botData.plays_limit,
                total_bot_bid: 0,
                price_limit: botData?.price_limit || 0.0,
            };
            await redisClient.set(
                `BidBotCount:${botData.auction_id}`,
                JSON.stringify(existingBotData)
            );
        }
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {
            message: MESSAGES.BIDBOT.BIDBOT_ACTIVE,
            auction_id: botData.auction_id,
            player_id: botData.player_id,
            plays_limit: botData.plays_limit,
            price_limit: botData?.price_limit,
            status: true,
        });
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
            message: MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
            auction_id: botData.auction_id,
        });
        return;
    }
};

/**
 * @description Handles the trigger to deactivate bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const deactivateBidbot = async (
    botData: { auction_id: string; player_id: string },
    socketId: string
) => {
    const auctionData = await redisClient.get(
        `auction:live:${botData.auction_id}`
    );
    if (auctionData?.length) {
        const existingBotData = JSON.parse(
            (await redisClient.get(
                `BidBotCount:${botData.auction_id}`
            )) as string
        );
        if (existingBotData && existingBotData[botData?.player_id]) {
            existingBotData[botData.player_id].is_active = false;
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {
                message: MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
                status: existingBotData[botData.player_id].is_active
            });
            await redisClient.set(
                `BidBotCount:${botData.auction_id}`,
                JSON.stringify(existingBotData)
            );
        } else {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BIDBOT_DATA_EMPTY,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
            });
            logger.error(
                MESSAGES.BIDBOT.BIDBOT_DATA_EMPTY + botData.auction_id
            );
            return;
        }
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
            message: AUCTION_MESSAGES.NOT_ACTIVE,
            auction_id: botData.auction_id,
        });
    }
};

/**
 * @description sends the bid bot status during a new session.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const bidbotStatus = async (
    botData: { auction_id: string; player_id: string },
    socketId: string
) => {
    const auctionData = await auctionQueries.getActiveAuctioById(
        botData.auction_id
    );
    if (auctionData?.state === "live") {
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);
        if (!existingBotData || !existingBotData[`${botData.player_id}`]) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {
                message: MESSAGES.BIDBOT.BIDBOT_NOT_FOUND,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
                status: false
            });
            return;
        }
        const player_bot = existingBotData[`${botData.player_id}`];
        if (player_bot) {
            existingBotData[botData.player_id].socket_id = socketId;
            const status = existingBotData[botData.player_id].is_active;
            socket.playerSocket
                .to(socketId)
                .emit(SOCKET_EVENT.BIDBOT_STATUS, {
                    message: status
                        ? MESSAGES.BIDBOT.BIDBOT_ACTIVE
                        : MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                    auction_id: botData.auction_id,
                    player_id: botData.player_id,
                    plays_limit: player_bot.plays_limit,
                    price_limit: player_bot?.price_limit,
                    status: status,
                });
            await redisClient.set(
                `BidBotCount:${botData.auction_id}`,
                JSON.stringify(existingBotData)
            );
        } else {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, {
                message: MESSAGES.BIDBOT.BIDBOT_NOT_FOUND,
                auction_id: botData.auction_id,
                player_id: botData.player_id,
            });
            return;
        }
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.AUCTION_NOT_FOUND,
        });
        return;
    }
};
