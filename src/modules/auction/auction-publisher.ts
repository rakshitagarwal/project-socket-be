import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import { bidRequestValidator } from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import { IBidAuction } from "../../middlewares/typings/middleware-types";
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
            const bidHistory = JSON.parse(
                (await redisClient.get(
                    `${auctionId}:bidHistory`
                )) as unknown as string
            );
            const winnerPlayer = bidHistory[bidHistory.length - 1];
            delete countdowns[auctionId];
            socket.playerSocket.emit("auction:", {
                message: "auction winner!",
                ...winnerPlayer,
            });
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


const recentBid=async(auctionId:string)=>{
    const bidHistory = JSON.parse(await redisClient.get(`${auctionId}:bidHistory`) as unknown as string);
    if(bidHistory.length<10){
        socket.playerSocket.emit("auction:recentBids",bidHistory)
    }else{
        socket.playerSocket.emit("auction:recentBids",bidHistory.slice(-10))
    }
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
    const isValid = await bidRequestValidator<IBidAuction>(
        bidPayload,
        auctionSchemas.ZbidAuction
    );
    if (!isValid.status) {
        socket.playerSocket.to(socketId).emit("auction:error", { ...isValid });
    } else {
        const { bidData } = isValid;
        const isAuction = countdowns[bidData.auctionId];
        if (!isAuction) {
            socket.playerSocket
                .to(socketId)
                .emit("auction:error", { message: "auction not found" });
        } else {
            const isPre_register = await redisClient.get(
                "auction:pre-register"
            );
            if (isPre_register?.length) {
                const preRegisterData = JSON.parse(isPre_register);
                if (
                    !preRegisterData[`${bidData.auctionId + bidData.playerId}`]
                ) {
                    socket.playerSocket
                        .to(socketId)
                        .emit("auction:error", {
                            message: "user is not registered on this auction",
                        });
                } else {
                    const isBidHistory = await redisClient.get(
                        `${bidData.auctionId}:bidHistory`
                    );
                    countdowns[bidData.auctionId] = 10;
                    if (!isBidHistory) {
                        await redisClient.set(
                            `${bidData.auctionId}:bidHistory`,
                            JSON.stringify([
                                { ...bidData, current_timestamp: new Date() },
                            ])
                        );
                        recentBid(bidData.auctionId)
                    } else {
                        const bidHistoryData = JSON.parse(isBidHistory);
                        if (
                            bidHistoryData[bidHistoryData.length - 1]
                                .playerId === bidData.playerId
                        ) {
                            socket.playerSocket
                                .to(socketId)
                                .emit("auction:error", {
                                    message: "continue bid not allow",
                                });
                        } else {
                            bidHistoryData.push({
                                ...bidData,
                                current_timestamp: new Date(),
                            });
                            await redisClient.set(
                                `${bidData.auctionId}:bidHistory`,
                                JSON.stringify(bidHistoryData)
                            );
                            recentBid(bidData.auctionId)
                        }
                    }
                }
            } else {
                socket.playerSocket
                    .to(socketId)
                    .emit("auction:error", { message: "you'r not registered" });
            }
        }
    }
};
