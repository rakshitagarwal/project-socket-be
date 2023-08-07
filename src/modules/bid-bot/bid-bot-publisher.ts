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


export const executeBidbot = async function (
    botData: IBidBotData,
    remeaning_second:number
) {
    if (botData.plays_limit  <= 0) {
        socket.playerSocket.to(botData.socket_id as string).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "plays limit reached"});
        return;
    }

    // const bidHistory = JSON.parse((await redisClient.get(`${botData.auction_id}:bidHistory`)) as string);
    // if (bidHistory && bidHistory[bidHistory.length - 1]?.player_id === randomClient?.player_id as string) {
    //     randomClient = bidBotCollection[Math.floor(Math.random() * bidBotCollection.length)];
    // }
    await newBiDRecieved({
            player_id: botData.player_id,
            auction_id: botData.auction_id,
            player_name: botData.player_name,
            profile_image: botData.profile_image,
            remaining_seconds: remeaning_second ,
            // player_bot_id: randomClient?.id,
        }, botData.socket_id as string);

    // if (bidSuccess === "pass") {
    // const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${botData.auction_id}`) as string);
    // const auctionRunning = JSON.parse((await redisClient.get(`auction:live:${botData.auction_id}`)) as string);
    // const playsUpdated = (existingBotData[`${botData}`].plays_limit  - auctionRunning.plays_consumed_on_bid) as number;
    // existingBotData[`${botData.player_id}`].plays_limit = playsUpdated;
    // await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    // console.log("7");
    // }
};

const tempStorage: {[auctionId:string]:number}= {}; // to store random time

eventService.on(NODE_EVENT_SERVICE.COUNTDOWN, async function (countdown: number,auctionId: string) {    
    if(!tempStorage[`${auctionId}`]){
        const rng = seedrandom();
        const randomNumber = rng();
        const randomTime: number = Math.floor((randomNumber as unknown as number) * 5) + 1;
        tempStorage[`${auctionId}`] = randomTime;
    }
    if(tempStorage[auctionId] && tempStorage[auctionId] === countdown){
        const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${auctionId}`) as string);
        const bidBotCollection = Object.keys(existingBotData);
        const randomIndex = Math.floor(Math.random() * bidBotCollection.length);
        const selectRandom = bidBotCollection[randomIndex];
        const randomBot = existingBotData[`${selectRandom}`];
        console.log(randomBot, "selected randomBot");
        executeBidbot(randomBot,countdown);   
        const rng = seedrandom();
        const randomNumber = rng();
        const randomTime: number = Math.floor((randomNumber as unknown as number) * 5) + 1;
        tempStorage[`${auctionId}`] = randomTime;     
    }
});

export const bidByBotRecieved = async (botData: IBidBotData, socketId: string) => {
    const wallet = await userQueries.playerPlaysBalance(botData.player_id)   as unknown as{play_balance:number};
    if ((wallet?.play_balance as number) < botData.plays_limit) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient"});
        return;
    }

    const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id,botData.auction_id);
    if (!existBot) await bidBotService.addBidBot(botData);

    const existingBotData = JSON.parse(await redisClient.get(`BidBotCount:${botData.auction_id}`) as string);
    console.log(existingBotData, "existingBotData");
    
    const playerInfo = {
        player_id: botData.player_id,
        auction_id: botData.auction_id,
        plays_limit: botData.plays_limit,
        player_name: botData.player_name,
        profile_image: botData.profile_image,
        socket_id: socketId
        }

        if(!existingBotData){
            await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({[botData.player_id]:playerInfo}));
        
        } else if (existingBotData[botData.player_id] && existingBotData[botData.player_id]?.plays_limit === 0) {
            existingBotData[botData.player_id] = playerInfo;
            await redisClient.set(`BidBotCount:${botData.auction_id}`, JSON.stringify(existingBotData));
        } else if (!existingBotData[botData.player_id]) {
            existingBotData[botData.player_id] = playerInfo;
            await redisClient.set(`BidBotCount:${botData.auction_id}`, JSON.stringify(existingBotData));
        }
        

    // if(existingBotData){
    //     if( existingBotData[`${botData.player_id}`] && existingBotData[`${botData.player_id}`]?.plays_limit===0){
    //         existingBotData[`${botData.player_id}`]= playerInfo;
    //         await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    //     }else if(!existingBotData[`${botData.player_id}`]){
    //         existingBotData[`${botData.player_id}`] = playerInfo;
    //         await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify(existingBotData));
    //    }
    // }
    // else if(!existingBotData){
    //     await redisClient.set(`BidBotCount:${botData.auction_id}`,JSON.stringify({[botData.player_id]:playerInfo}));
    // } 
};
