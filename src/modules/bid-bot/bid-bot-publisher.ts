import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import { NODE_EVENT_SERVICE, SOCKET_EVENT } from "../../common/constants";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData } from "./typings/bid-bot-types";
import bidBotService from "./bid-bot-services";
import { newBiDRecieved } from "../auction/auction-publisher";
import seedrandom from "seedrandom";
import logger from "../../config/logger";
import eventService from "../../utils/event-service";
import { auctionQueries } from "../auction/auction-queries";
const socket = global as unknown as AppGlobal;
const tempStorage: { [auctionId: string]: number } = {}; // to store random time

/**
 * @description Temporarily stores a random time for a specific auction.
 * @param {string} auctionId - The ID of the auction.
 */
const randomTime =  (auctionId: string) => {
    const random = seedrandom();
    const randomTime: number = Math.floor(+(random()) * 5) + 1;
    tempStorage[`${auctionId}`] = randomTime;
}

// Event listener for countdown events in the auction
eventService.on(NODE_EVENT_SERVICE.COUNTDOWN, async function (countdown: number, auctionId: string) {
    if (!tempStorage[`${auctionId}`]) {
        randomTime(auctionId); // set random time for bot' bid execution
    }
    if (tempStorage[auctionId] && tempStorage[auctionId] === countdown) {
        // ... Rest of the code for bidding logic
        const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${auctionId}`) as string);
        if (!existingBotData) {
            logger.error(`No existing bot data found for auction ID ${auctionId}`);
        } else {
            const bidBotCollection = Object.keys(existingBotData);
        const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as string);
        let selectRandom;
        if (bidHistory) {
            const lastBidder = bidHistory[bidHistory.length - 1].player_id;
            const filteredBotCollection = bidBotCollection.filter(
                (playerId) =>playerId !== lastBidder && existingBotData[`${playerId}`].plays_limit > 0);
            const randomIndex = Math.floor(Math.random() * filteredBotCollection.length);
            selectRandom = filteredBotCollection[randomIndex];   
        } else {
            const randomIndex = Math.floor(Math.random() * bidBotCollection.length);
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
                    player_bot_id: randomBot.player_bot_id,
                },
                randomBot.socket_id as string
            );
        }
        randomTime(auctionId); // set random time for bot' bid execution
    }
    }

    if (!countdown) {
        // ... Rest of the code for finalizing auction and updating bot data
        const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${auctionId}`) as string);
        if (!existingBotData) {
            logger.error(`No existing bot data found for auction ID ${auctionId}`);
        } else {
            const bidBotCollection = Object.keys(existingBotData);
            const updatePromises = bidBotCollection.map(async (playerId) => {
                const { total_bot_bid, player_bot_id } = existingBotData[playerId];
                await bidBotQueries.updateBidBotMany({
                    auction_id: auctionId,
                    player_id: playerId,
                    total_bot_bid: total_bot_bid,
                    plays_limit: 0,
                    player_bot_id: player_bot_id
                });
            });
            await Promise.all(updatePromises);
            await redisClient.del(`BidBotCount:${auctionId}`);
            delete tempStorage[auctionId]; // Remove the object from memory
        }
        
    }
});

/**
 * @description Handles the bid received from a bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const bidByBotRecieved = async (botData: IBidBotData, socketId: string) => {
    const auctionData = await auctionQueries.getActiveAuctioById(botData.auction_id)    
    if(auctionData?.state === "live"){
    
    const wallet = (await userQueries.playerPlaysBalance(botData.player_id)) as unknown as [{ play_balance: number }];
    
    if ((wallet[0]?.play_balance as number) < botData.plays_limit || !wallet.length) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient"});
        return;
    }

    const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id, botData.auction_id);
    let bot_id = existBot?.id;
    if (existBot) await bidBotQueries.updateBidBot(existBot?.id, botData.plays_limit);
    if (!existBot) bot_id = await bidBotService.addBidBot(botData) as string;

    const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);

    const bidByBotInfo = {
        ...botData,
        total_bot_bid: 0,
        socket_id: socketId,
        is_active: true,
        player_bot_id: bot_id
    };

    if (!existingBotData) {
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({ [botData.player_id]: bidByBotInfo }));
    } else if (existingBotData[botData.player_id]) {
        existingBotData[botData.player_id] = bidByBotInfo;
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    } else if (!existingBotData[botData.player_id]) {
        existingBotData[botData.player_id] = bidByBotInfo;
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    }
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: "auction not active"});
    }
};

/**
 * @description Handles the trigger to deactivate bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const deactivateBidbot = async (botData: IBidBotData, socketId: string) => {
    const auctionData = await auctionQueries.getActiveAuctioById(botData.auction_id)    
    if(auctionData?.state === "live"){
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);
        const total_bot_bid = existingBotData[botData.player_id].total_bot_bid;
        delete existingBotData[botData.player_id];
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));

        const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id, botData.auction_id);
        if (existBot) await bidBotQueries.updateBidBotDeactivate(existBot.id, total_bot_bid);
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_DEACTIVATE, {message: "bidbot not active"});
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: "auction not active"});
    }
};