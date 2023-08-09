import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import { NODE_EVENT_SERVICE, SOCKET_EVENT } from "../../common/constants";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData } from "./typings/bid-bot-types";
import bidBotService from "./bid-bot-services";
import { newBiDRecieved } from "../auction/auction-publisher";
import seedrandom from "seedrandom";
import eventService from "../../utils/event-service";
const socket = global as unknown as AppGlobal;

/**
 * Executes a bid by the bid bot in an auction.
 * @param {IBidBotData} botData - The data of the bid bot.
 * @param {number} remeaning_second - The remaining time in seconds for the auction.
 */
export const executeBidbot = async function (botData: IBidBotData, remeaning_second: number) {    
    if (botData) {
        await newBiDRecieved(
            {
                player_id: botData.player_id,
                auction_id: botData.auction_id,
                player_name: botData.player_name as string,
                profile_image: botData.profile_image as string,
                remaining_seconds: remeaning_second,
            },
            botData.socket_id as string
        );
    }
};


const tempStorage: { [auctionId: string]: number } = {}; // to store random time

/**
 * Temporarily stores a random time for a specific auction.
 * @param {string} auctionId - The ID of the auction.
 */
const randomTime =  (auctionId: string) => {
    const random = seedrandom();
    const randomNumber = random();
    const randomTime: number = Math.floor((randomNumber as unknown as number) * 5) + 1;
    tempStorage[`${auctionId}`] = randomTime;
}

// Event listener for countdown events in the auction
eventService.on(NODE_EVENT_SERVICE.COUNTDOWN, async function (countdown: number, auctionId: string) {
        if (!tempStorage[`${auctionId}`]) {
            randomTime(auctionId); // set random time for bot' bid execution
        }
        if (tempStorage[auctionId] && tempStorage[auctionId] === countdown) {
            // ... Rest of the code for bidding logic
            const existingBotDataString = await redisClient.get(`BidBotCount:${auctionId}`);
            const existingBotData = JSON.parse(existingBotDataString || '{}');
            if (!existingBotData) {
                console.log(`No existing bot data found for auction ID ${auctionId}`);
            } else {
                const bidBotCollection = Object.keys(existingBotData);
            const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as string);
            let lastBidder: string;
            let selectRandom;
            if (bidHistory) {
                lastBidder = bidHistory[bidHistory.length - 1].player_id;
                let filteredBotCollection = bidBotCollection;
                if (lastBidder)
                    filteredBotCollection = bidBotCollection.filter(
                        (playerId) =>playerId !== lastBidder && existingBotData[`${playerId}`].plays_limit > 0);

                const randomIndex = Math.floor(Math.random() * filteredBotCollection.length);
                selectRandom = filteredBotCollection[randomIndex];
            } else {
                const randomIndex = Math.floor(Math.random() * bidBotCollection.length);
                selectRandom = bidBotCollection[randomIndex];
            }
            const randomBot = existingBotData[`${selectRandom}`];
            executeBidbot(randomBot, countdown);
            randomTime(auctionId); // set random time for bot' bid execution
        }
        }

        if (countdown === 0) {
            // ... Rest of the code for finalizing auction and updating bot data
            const existingBotDataString = await redisClient.get(`BidBotCount:${auctionId}`);
            const existingBotData = JSON.parse(existingBotDataString || '{}');
            if (!existingBotData) {
                console.log(`No existing bot data found for auction ID ${auctionId}`);
            } else {
                const bidBotCollection = Object.keys(existingBotData);
            
                const updatePromises = bidBotCollection.map(async (playerId) => {
                    const { total_bot_bid } = existingBotData[playerId];
                    const data = {
                        auction_id: auctionId,
                        player_id: playerId,
                        total_bot_bid: total_bot_bid,
                        plays_limit: 0
                    };
                    await bidBotQueries.updateBidBotMany(data);
                });
                await Promise.all(updatePromises);
                await redisClient.del(`BidBotCount:${auctionId}`);
            }
            
        }
    }
);

/**
 * Handles the bid received from a bid bot.
 * @param {IBidBotData} botData - The bid bot's data.
 * @param {string} socketId - The ID of the socket connection.
 */
export const bidByBotRecieved = async ( botData: IBidBotData, socketId: string) => {
    const wallet = (await userQueries.playerPlaysBalance(botData.player_id)) as unknown as { play_balance: number };
    if ((wallet?.play_balance as number) < botData.plays_limit) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient"});
        return;
    }

    const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id, botData.auction_id);
    if (!existBot) await bidBotService.addBidBot(botData);

    const existingBotData = JSON.parse((await redisClient.get(`BidBotCount:${botData.auction_id}`)) as string);

    const bidByBotInfo = {
        player_id: botData.player_id,
        auction_id: botData.auction_id,
        plays_limit: botData.plays_limit,
        total_bot_bid: 0,
        player_name: botData.player_name,
        profile_image: botData.profile_image,
        socket_id: socketId,
    };

    if (!existingBotData) {
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({ [botData.player_id]: bidByBotInfo }));
    } else if (existingBotData[botData.player_id] && existingBotData[botData.player_id]?.plays_limit === 0) {
        existingBotData[botData.player_id] = bidByBotInfo;
        await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    } else if (!existingBotData[botData.player_id]) {
        existingBotData[botData.player_id] = bidByBotInfo;
        await redisClient.set(`BidBotCount:${botData.auction_id}`, JSON.stringify(existingBotData));
    }
};
