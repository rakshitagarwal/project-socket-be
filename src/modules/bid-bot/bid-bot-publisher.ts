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
 * @description Temporarily stores a random time for a specific auction.
 * @param {string} auctionId - The ID of the auction.
 */
const randomTime = (auctionId: string) => {
    const random = seedrandom();
    const randomTime: number = Math.floor(+random() * 5) + 1;
    tempStorage[`${auctionId}`] = randomTime;
};

async function filterBotCollection(
    bidBotCollection: string[],
    lastBidderId: string,
    lastBidPrice: number,
    existingBotData: {[playerId:string]:{plays_limit:number ,is_active:boolean,price_limit:number|undefined}},
    auctionId: string,
): Promise<string[]> {
    const filteredPlayerIds: string[] = await bidBotCollection.reduce(
        async (promise: Promise<string[]>, playerId: string) => {
            const filteredIds = await promise;
            const playerinfo=existingBotData[playerId]
            if (playerId !== lastBidderId && playerinfo && playerinfo.plays_limit > 0 && playerinfo.is_active) {
                const playerPriceLimit = playerinfo.price_limit;
                if ((playerPriceLimit && lastBidPrice > playerPriceLimit)) {
                    const bidBotInfo = JSON.parse(await redisClient.get(`BidBotCount:${auctionId}`) as string);
                    bidBotInfo[playerId].is_active = false;
                    await redisClient.set(`BidBotCount:${bidBotInfo[playerId].auction_id}`, JSON.stringify(bidBotInfo));
                } else {
                    filteredIds.push(playerId);
                }
            }
            return filteredIds;
        },
        Promise.resolve([]) // Initial promise resolves to an empty array
    );

    return filteredPlayerIds;
}

// Event listener for countdown events in the auction
eventService.on(NODE_EVENT_SERVICE.COUNTDOWN,async function (countdown: number, auctionId: string) {
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
                const filteredBotCollection = await filterBotCollection(bidBotCollection,lastBidder.player_id,lastBidder.bid_price,existingBotData,auctionId)
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
                    player_bot_id: randomBot.player_bot_id
                }, randomBot.socket_id as string);
                socket.playerSocket.to(randomBot.socket_id).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: "bidbot not active"});
            }
            randomTime(auctionId); // set random time for bot' bid execution
        }
    }

    if (!countdown) {
        // ... Rest of the code for executing auction end tasks and updating bot data
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${auctionId}`)) as string);
        if (!existingBotData) {
            logger.error(`No existing bot data found for auction ID ${auctionId}`);
        } else {
            const bidBotCollection:IBidBotData[] = Object.values(existingBotData);
            const bidBodData=bidBotCollection.map((items)=>{
                delete items.player_name
                delete items.profile_image
                delete items.socket_id
                return items
            })
            await bidBotQueries.addBidBotMany(bidBodData as IBidBotData[]);
        // const bidBotCollection = Object.keys(existingBotData);
        //     const updatePromises = bidBotCollection.map(async (playerId) => {
        //         const { total_bot_bid, player_bot_id, socket_id } = existingBotData[playerId];
        //             await bidBotQueries.updateBidBotMany({
        //             auction_id: auctionId,
        //             player_id: playerId,
        //             total_bot_bid: total_bot_bid,
        //             plays_limit: 0,
        //             player_bot_id: player_bot_id,
        //             price_limit: existingBotData[playerId].price_limit || 0.00
        //         });
        //         socket.playerSocket.to(socket_id).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: "bidbot not active"});
        //     }existingBotData
        // );
            // await Promise.all(updatePromises);
            await redisClient.del(`BidBotCount:${auctionId}`);
            await redisClient.del(`auction:live:${auctionId}`);
            delete tempStorage[auctionId]; // Remove the object from memory
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
        const wallet = (await userQueries.playerPlaysBalance( botData.player_id)) as unknown as [{ play_balance: number }];
        if ((wallet[0]?.play_balance as number) < botData.plays_limit || !wallet.length) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient",});
            return;
        }

        // const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id,botData.auction_id);
        // let bot_id = existBot?.id;
        // if (existBot) { 
        //     await bidBotQueries.updateBidBot(existBot?.id, botData.plays_limit);
        // } else {
        //     bot_id = (await bidBotService.addBidBot(botData)) as string;
        // }

        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);

        const bidByBotInfo = {
            ...botData,
            socket_id: socketId,
            total_bot_bid: 0,
            is_active: true,
            // player_bot_id: bot_id,
        };

        if (!existingBotData) {
            await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({ [botData.player_id]: bidByBotInfo }));
        } else if (!existingBotData[botData.player_id]) {
            existingBotData[botData.player_id] = bidByBotInfo;
            await redisClient.set(`BidBotCount:${botData.auction_id}`, JSON.stringify(existingBotData));
        } else  if (existingBotData[botData.player_id]) {
            existingBotData[botData.player_id].is_active = true;
            existingBotData[botData.player_id].plays_limit = botData.plays_limit;
            existingBotData[botData.player_id].price_limit = botData?.price_limit;
            await redisClient.set(`BidBotCount:${botData.auction_id}`, JSON.stringify(existingBotData));
        }
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: "bidbot active"});
    } else {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: "auction not active",});
    }
};

/**
 * @description Handles the trigger to deactivate bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const deactivateBidbot = async (botData: { auction_id: string; player_id: string },socketId: string) => {
    const auctionData = await auctionQueries.getActiveAuctioById(botData.auction_id);
    if (auctionData?.state === "live") {
        const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);
        existingBotData[botData.player_id].is_active = false;
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {message: "bidbot not active"});
    } 
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_BIDBOT, {message: "auction not active"});
};
