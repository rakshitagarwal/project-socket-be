import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import { bidRequestValidator } from "../../middlewares/validateRequest";
import { auctionSchemas } from "../auction/auction-schemas";
import { IBidAuction } from "../../middlewares/typings/middleware-types";
import userQueries from "../users/user-queries"
import userService from  "../users/user-services"
import eventService from "../../utils/event-service";
import { NODE_EVENT_SERVICE,MESSAGES,SOCKET_EVENT } from "../../common/constants";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import bidBotQueries from "./bid-bot-queries";
const socket = global as unknown as AppGlobal;
const countdowns: { [auctionId: string]: number } = {}; // Countdown collection
const activeBidBot = []; // Active bidbot collection

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
const recentBid = async (auctionId: string) => {
    const bidHistory = JSON.parse((await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string);
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_RECENT_BID, {message: MESSAGES.SOCKET.AUCTION_RECENT_BID,data:bidHistory[bidHistory.length - 1]});
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_BIDS, {message:MESSAGES.SOCKET.RECENT_BIDS,data:bidHistory.slice(-10),auctionId});
};

/**
 * @description - create a bid transaction if player wallet balance greater than auction consumed bid value othrewise return false
 * @param playload - playload containing player ID and socket Id and auction Id
 * @returns {Promise<void>}
 */
const bidTransaction=async(playload:{playerId:string,socketId:string,auctionId:string})=>{
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

export const selectRandomBidClient = async function selectRandomBidClient(auction_id: number) {
    let selectRandomBidClient = null;
    const allBidBots = await bidBotQueries.getAllBidBot();
    const isBidHistory = await redisClient.get( `${auction_id}:bidHistory`);

    if (allBidBots.length > 0) {
      const remainingClients = allBidBots.filter((client) => client.bid_limit > 0);
      if (remainingClients.length === 0) {
        return false; // No other clients available to bid, so return false
      }
  
      const randomIndex = Math.floor(Math.random() * remainingClients.length);
      const randomClient = remainingClients[randomIndex];
      selectRandomBidClient = randomClient;
      return selectRandomBidClient;
    }
    return null;
  }

/**
 * Handles a new bid by bidbot received for an auction.
 * @async
 * @param {IBidAuction} bidPayload - The bid data payload.
 * @param {string} socketId - The ID of the socket for sending the response.
 * @returns {Promise<void>}
 */
export const newBidByBotRecieved = async (bidPayload: IBidAuction, socketId: string) => {
    const isValid = await bidRequestValidator<IBidAuction>(bidPayload,auctionSchemas.ZbidAuction);
    if (!isValid.status) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { ...isValid });
    } else {
        const { bidData } = isValid;
        const isAuction = countdowns[bidData.auction_id];
        if (!isAuction) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: MESSAGES.SOCKET.AUCTION_NOT_FOUND});
        } else {            
            const isPre_register = await redisClient.get("auction:pre-register");
            if (isPre_register?.length) {
                    const preRegisterData = JSON.parse(isPre_register);
                    if (!preRegisterData[`${bidData.auction_id + bidData.player_id}`]) {
                        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message:MESSAGES.SOCKET.USER_NOT_REGISTERED,});
                    } else {                        
                        const isBalance= await bidTransaction({playerId:bidData.player_id,socketId,auctionId:bidData.auction_id})
                        if(isBalance.status){
                            const newBidData={ ...bidData, bid_price:isBalance.bidPrice, bid_number:isBalance.bidNumber}                    
                             const isBidHistory = await redisClient.get( `${newBidData.auction_id}:bidHistory`);
                        if (!isBidHistory) {
                            countdowns[newBidData.auction_id] = 10;
                            await redisClient.set( `${newBidData.auction_id}:bidHistory`, JSON.stringify([ { ...newBidData,created_at:new Date()}, ]));
                            recentBid(newBidData.auction_id);
                        } else {
                            const bidHistoryData = JSON.parse(isBidHistory);
                            if (bidHistoryData[bidHistoryData.length - 1].player_id === newBidData.player_id) {
                                socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {    message:MESSAGES.SOCKET.CONTINUE_BID_NOT_ALLOWED,});
                            } else { 
                                // bid place by bidbot
                                const isBotEnabled = bidData?.player_bot_id;
                                if(isBotEnabled){
                                    console.log(isBotEnabled, "BotEnabled");
                                    const bidBotData = await redisClient.get(`${bidData.auction_id}:${bidData.player_id}:bidbot`);
                                    if (bidBotData !== null) {
                                        const splitArray = bidBotData.split(":");
                                        const playerId = splitArray[0];
                                        const playerBotLimit = splitArray[1];
                                        const bidByBot: { [key: string]: number } = {};
                                        bidByBot[`${playerId}`] = Number(playerBotLimit);
                                        console.log(bidByBot, "bidByBot");
                                        activeBidBot.push(bidByBot);
                                    }
                                }
                                // bid place by bidbot
                                countdowns[newBidData.auction_id] = 10;
                                bidHistoryData.push({ ...newBidData,created_at:new Date()});
                                await redisClient.set(`${newBidData.auction_id}:bidHistory`,JSON.stringify(bidHistoryData));
                                recentBid(newBidData.auction_id);
                            }
                        }
                    }
                    else{
                        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message:MESSAGES.SOCKET.INSUFFICIENT_PLAYS_BALANCED });
                    }
                }
            } else {
                socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: MESSAGES.SOCKET.USER_NOT_REGISTERED });
            }
        }
    }
};
