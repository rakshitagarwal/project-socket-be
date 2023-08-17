import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import { NODE_EVENT_SERVICE, SOCKET_EVENT } from "../../common/constants";
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
 * @param {string[]} bidBotCollection - Collection of bid bot IDs.
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
            if (playerId !== lastBidderId && playerinfo && playerinfo.plays > 0 && playerinfo.is_active) {
                const playerPriceLimit = playerinfo.price_limit;
                if (playerPriceLimit && lastBidPrice >= playerPriceLimit) {
                    const bidBotInfo = JSON.parse((await redisClient.get(`BidBotCount:${auctionId}`)) as string);
                    bidBotInfo[playerId].is_active = false;
                    socket.playerSocket.to(playerinfo.socket_id).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: `bidbot not active:${playerinfo.auction_id}:${playerinfo.player_id}`});
                    await redisClient.set(`BidBotCount:${bidBotInfo[playerId].auction_id}`, JSON.stringify(bidBotInfo));
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
eventService.on(NODE_EVENT_SERVICE.COUNTDOWN, async function (countdown: number, auctionId: string) {
        if (!tempStorage[`${auctionId}`]) {
            randomTime(auctionId);
        }
        
        if (tempStorage[auctionId] && tempStorage[auctionId] === countdown) {
            const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${auctionId}`)) as string);
            if (!existingBotData) {
                logger.error(`No existing bot data found for auction ID ${auctionId}`);
            } else {
                const bidBotCollection = Object.keys(existingBotData);
                const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as string);
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
                    const randomIndex = Math.floor(Math.random() * filteredBotCollection.length);
                    selectRandom = filteredBotCollection[randomIndex];
                } else {
                    const randomIndex = Math.floor(Math.random() * bidBotCollection.length);
                    selectRandom = bidBotCollection[randomIndex];
                }
                const randomBot = existingBotData[`${selectRandom}`];
                if (randomBot) {
                    await newBiDRecieved({
                            player_id: randomBot.player_id,
                            auction_id: randomBot.auction_id,
                            player_name: randomBot.player_name as string,
                            profile_image: randomBot.profile_image as string,
                            remaining_seconds: countdown,
                            player_bot_id: randomBot.player_bot_id,
                        }, randomBot.socket_id as string);
                    socket.playerSocket.to(randomBot.socket_id).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: `bidbot active:${randomBot.auction_id}:${randomBot.player_id}`});
                }
                randomTime(auctionId);
            }
        }

        if (!countdown) {
            const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${auctionId}`)) as string);
            if (!existingBotData) {
                logger.error(`No existing bot data found for auction ID: ${auctionId}`);
            } else {
                const bidBotCollection: IBidBotData[] = Object.values(existingBotData);
                const arr: IBidBotData[] = [];
                bidBotCollection.map((items) => {
                    const { player_id, auction_id, plays_limit, price_limit, total_bot_bid } = items;
                    arr.push({
                        player_id, 
                        auction_id, 
                        plays_limit, 
                        price_limit, 
                        total_bot_bid, 
                        is_active: false
                    })
                });
                await bidBotQueries.addBidBotMany(arr as unknown as IBidBotData[]);
                await redisClient.del(`BidBotCount:${auctionId}`);
                await redisClient.del(`auction:live:${auctionId}`);
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
export const bidByBotRecieved = async (botData: IBidBotData, socketId: string) => {
    const auctionData = await auctionQueries.getActiveAuctioById(botData.auction_id);
    if (auctionData?.state === "live") {
        if (botData.price_limit) {
            const bidPrices = JSON.parse((await redisClient.get(`${botData.auction_id}:bidHistory`)) as string);
            if (bidPrices && bidPrices.slice(-1).bid_price >= botData.price_limit) {
                socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "auction price already crossed price limit"});
                return;
            }
            if (botData.price_limit >= auctionData.products.price) {
                socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "bid price should be less than product price"});
                return;
            }
        }
        const wallet = (await userQueries.playerPlaysBalance(botData.player_id)) as unknown as [{ play_balance: number }];
        if ((wallet[0]?.play_balance as number) < botData.plays_limit || !wallet.length) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient"});
            return;
        }

        const bidByBotInfo = {
            ...botData,
            socket_id: socketId,
            total_bot_bid: 0,
            is_active: true,
            plays: botData.plays_limit,
        };
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);

        if (!existingBotData) {
            await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({ [botData.player_id]: bidByBotInfo }));
        } else if (!existingBotData[botData.player_id]) {
            existingBotData[botData.player_id] = bidByBotInfo;
            await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
        } else if (existingBotData[botData.player_id]) {
            existingBotData[botData.player_id].is_active = true;
            existingBotData[botData.player_id].plays_limit = botData.plays_limit;
            existingBotData[botData.player_id].plays = botData.plays_limit;
            existingBotData[botData.player_id].price_limit = botData?.price_limit || 0.00;
            await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
        }
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, { message: `bidbot active:${botData.auction_id}:${botData.player_id}` });
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: `auction not active:${botData.auction_id}`});
    }
};

/**
 * @description Handles the trigger to deactivate bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const deactivateBidbot = async (botData: { auction_id: string; player_id: string }, socketId: string) => {
    const auctionData = await auctionQueries.getActiveAuctioById(botData.auction_id);
    if (auctionData?.state === "live") {
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);
        existingBotData[botData.player_id].is_active = false;
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, { message: `bidbot not active:${botData.auction_id}:${botData.player_id}`});
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: `auction not active:${botData.auction_id}`});
    }
};
