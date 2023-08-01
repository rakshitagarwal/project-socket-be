import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
// import { bidRequestValidator } from "../../middlewares/validateRequest";
// import { auctionSchemas } from "../auction/auction-schemas";
// import { IBidAuction } from "../../middlewares/typings/middleware-types";
import userQueries from "../users/user-queries";
import userService from "../users/user-services";
import eventService from "../../utils/event-service";
import { NODE_EVENT_SERVICE, MESSAGES, SOCKET_EVENT } from "../../common/constants";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotInfo } from "./typings/bid-bot-types";
const socket = global as unknown as AppGlobal;
const countdowns: { [auctionId: string]: number } = {}; // Countdown collection


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
            const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string);
         if(bidHistory){
            const winnerPlayer = bidHistory[bidHistory.length - 1];
            delete countdowns[auctionId];
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {message: MESSAGES.SOCKET.AUCTION_WINNER,...winnerPlayer,});
            eventService.emit(NODE_EVENT_SERVICE.AUCTION_CLOSED,auctionId)
         }else{
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {message:MESSAGES.SOCKET.AUCTION_ENDED});
         }
         eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE,{auctionId:auctionId,state:AUCTION_STATE.completed})
        } else {
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_COUNT_DOWN, {
                message:MESSAGES.SOCKET.AUCTION_COUNT_DOWN,
                count: countdowns[auctionId],
                auctionId,
            });
            countdowns[auctionId] = (countdowns[auctionId] as number) - 1;
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
export const recentBid = async (auctionId: string) => {
    const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string);
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_RECENT_BID, {message: MESSAGES.SOCKET.AUCTION_RECENT_BID,data:bidHistory[bidHistory.length - 1]});
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_BIDS, {message:MESSAGES.SOCKET.RECENT_BIDS,data:bidHistory.slice(-10),auctionId});
};

/**
 * @description - create a bid transaction if player wallet balance greater than auction consumed bid value othrewise return false
 * @param playload - playload containing player ID and socket Id and auction Id
 * @returns {Promise<void>}
 */
export const bidTransaction=async(playload:{playerId:string,socketId:string,auctionId:string})=>{
    const isBalance=await userService.getPlayerWalletBalance(playload.playerId)
    const auctionData=JSON.parse(await redisClient.get(`auction:live:${playload.auctionId}`) as unknown as string)
    const data=isBalance.data as unknown as {play_balance:number}    
    if(data.play_balance>=auctionData.plays_consumed_on_bid){
        const bidHistory = JSON.parse(await redisClient.get(`${playload.auctionId}:bidHistory`) as unknown as string )
        if(bidHistory && (bidHistory.length*auctionData.bid_increment_price+auctionData.opening_price)>=auctionData.products.price){
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_ERROR, {message:MESSAGES.SOCKET.AUCTION_ENDED });
        }else{ 
           const bidNumber=bidHistory ? bidHistory.length+1 : 1
           const bidPrice=bidHistory ?( bidHistory.length*auctionData.bid_increment_price+auctionData.opening_price+auctionData.bid_increment_price):(auctionData.bid_increment_price+auctionData.opening_price)
            await userQueries.createBidtransaction({player_id:playload.playerId,plays:auctionData.plays_consumed_on_bid})
        socket.playerSocket.to(playload.socketId).emit(SOCKET_EVENT.AUCTION_CURRENT_PLAYS, {message:MESSAGES.SOCKET.CURRENT_PLAYS,play_balance:data.play_balance-auctionData.plays_consumed_on_bid });
            return {status:true,bidNumber,bidPrice}
        }
        
   }
   return {status:false} 
    
}

export const selectRandomBidClient = async function selectRandomBidClient() {
    const bidBotCollection = await bidBotQueries.bidBotCollection();
    if (bidBotCollection.length > 0) {
        const randomIndex = Math.floor(Math.random() * bidBotCollection.length);
        const randomClient = bidBotCollection[randomIndex];
        return randomClient;
    }
    return null;
};

export const executeBidbot = async function (botData: IBidBotInfo, bidBotId: string) {
    const redisData = await redisClient.get(`BidBotCount:${botData.player_id}:${botData.auction_id}:${bidBotId}`);
    const playsProvided = +(redisData as unknown as string);
    if (!redisData?.length) console.log("error");
    if (playsProvided <= 0) socket.playerSocket.to(bidBotId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "plays limit reached"});
    
    const isBidHistory = await redisClient.get(`${botData.auction_id}:bidHistory`);
    const bidHistory = JSON.parse(isBidHistory as unknown as string);
    const lastBid = bidHistory[bidHistory.length - 1];
    console.log(lastBid, "last bid history");
    console.log(bidBotId);
    if ((countdowns[botData.auction_id] as unknown as number) > 5) {
        console.log("time for placing a bid not allowed");
    }

    const randomClient = await selectRandomBidClient();
    console.log(randomClient);
    if (lastBid.player_id === randomClient?.player_id) {
        console.log("continue not allowed");
    } else {
        const auctionRunning = await redisClient.get(`auction:live:${botData.auction_id}`);
        const auctionDetail = JSON.parse(auctionRunning as unknown as string);
        const playsUpdated = playsProvided - auctionDetail.plays_consumed_on_bid;
        await redisClient.set(`BidBotCount:${botData.player_id}:${botData.auction_id}:${bidBotId}`,`${playsUpdated}`);
        // await bidBotQueries.updateBidBot(bidBotId, playsUpdated);
    }
};

export const bidByBotRecieved = async (bidPayload: IBidBotInfo, socketId: string) => {
    const Data = await redisClient.get(`${bidPayload.auction_id}:bidbot`);
    const bidBotData = JSON.parse(Data as unknown as string);
    console.log(bidBotData, "bidBotData");
    console.log(socketId);

    const randomIndex = Math.floor(Math.random() * bidBotData.length);
    const randomClient = bidBotData[randomIndex];
    console.log(randomClient, "randomClient");
};
