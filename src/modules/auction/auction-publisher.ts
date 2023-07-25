import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import { bidRequestValidator } from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import { IBidAuction } from "../../middlewares/typings/middleware-types";
import userQueries from "../users/user-queries"
import userService from  "../users/user-services"
import eventService from "../../utils/event-service";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
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
            socket.playerSocket.emit("auction:winner", {message: "auction winner!",...winnerPlayer,});
            eventService.emit("auction:closed",auctionId)
         }else{
            socket.playerSocket.emit("auction:winner", {message: "auction closed!",});
         }
         eventService.emit("auction:live:db:update",{auctionId:auctionId,state:AUCTION_STATE.completed})
        } else {
            socket.playerSocket.emit("auction:count-down", {
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
    const bidHistory = JSON.parse(
        (await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string
    );
    if (bidHistory.length < 10) {
        socket.playerSocket.emit("auction:recentBids", bidHistory);
        socket.playerSocket.emit("auction:recent:bid", {message: "auction recent bid!",data:bidHistory[bidHistory.length - 1]});

    } else {
        socket.playerSocket.emit("auction:recentBids", bidHistory.slice(-10));
        socket.playerSocket.emit("auction:recent:bid", {message: "auction recent bid!",data:bidHistory[bidHistory.length - 1]});

    }
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
            socket.playerSocket.emit("auction:error", {message:"auction ended!" });
        }else{ 
           const bidNumber=bidHistory ? bidHistory.length+1 : 1
           const bidPrice=bidHistory ? bidHistory.length*auctionData.bid_increment_price+auctionData.opening_price+auctionData.bid_increment_price:auctionData.bid_increment_price+auctionData.opening_price
            await userQueries.createBidtransaction({player_id:playload.playerId,plays:auctionData.plays_consumed_on_bid})
        socket.playerSocket.to(playload.socketId).emit("auction:current:plays", {message:"current plays",play_balance:data.play_balance-auctionData.plays_consumed_on_bid });
            return {status:true,bidNumber,bidPrice}
        }
        
   }
   return {status:false} 
    
}
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
    const isValid = await bidRequestValidator<IBidAuction>(bidPayload,auctionSchemas.ZbidAuction);
    if (!isValid.status) {
        socket.playerSocket.to(socketId).emit("auction:error", { ...isValid });
    } else {
        const { bidData } = isValid;
        const isAuction = countdowns[bidData.auction_id];
        if (!isAuction) {
            socket.playerSocket.to(socketId).emit("auction:error", { message: "auction not found" });
        } else {
            const isPre_register = await redisClient.get("auction:pre-register");
            if (isPre_register?.length) {
                const isBalance= await bidTransaction({playerId:bidData.player_id,socketId,auctionId:bidData.auction_id})
                if(isBalance.status){
                    const newBidData={
                        ...bidData,
                        bid_price:isBalance.bidPrice,
                        bid_number:isBalance.bidNumber
                    }                    
                    const preRegisterData = JSON.parse(isPre_register);
                    if (!preRegisterData[`${newBidData.auction_id + newBidData.player_id}`]) {
                        socket.playerSocket.to(socketId).emit("auction:error", { message: "user is not registered on this auction",});
                    } else {
                        const isBidHistory = await redisClient.get( `${newBidData.auction_id}:bidHistory`);
                        
                        if (!isBidHistory) {
                            countdowns[newBidData.auction_id] = 10;
                            await redisClient.set( `${newBidData.auction_id}:bidHistory`, JSON.stringify([ { ...newBidData,created_at:new Date()}, ]));
                            recentBid(newBidData.auction_id);
                        } else {
                            const bidHistoryData = JSON.parse(isBidHistory);
                            if (bidHistoryData[bidHistoryData.length - 1].player_id === newBidData.player_id) {
                                socket.playerSocket.to(socketId).emit("auction:error", {    message: "continue bid not allowed",});
                            } else { 
                                countdowns[newBidData.auction_id] = 10;
                                bidHistoryData.push({ ...newBidData,created_at:new Date()});
                                await redisClient.set(`${newBidData.auction_id}:bidHistory`,JSON.stringify(bidHistoryData));
                                recentBid(newBidData.auction_id);
                            }
                        }
                    }
                }else{
                    socket.playerSocket.to(socketId).emit("auction:error", {message:"insufficient play balance!" });
                }
            } else {
                socket.playerSocket.to(socketId).emit("auction:error", { message: "you'r not registered" });
            }
        }
    }
};
