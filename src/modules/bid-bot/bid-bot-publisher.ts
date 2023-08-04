import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import userService from "../users/user-services";
import eventService from "../../utils/event-service";
import { NODE_EVENT_SERVICE, MESSAGES, SOCKET_EVENT } from "../../common/constants";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData } from "./typings/bid-bot-types";
import bidBotService from "./bid-bot-services";
import { countdowns, newBiDRecieved } from "../auction/auction-publisher";
const socket = global as unknown as AppGlobal;

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
            if (bidHistory) {
                const winnerPlayer = bidHistory[bidHistory.length - 1];
                delete countdowns[auctionId];
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_WINNER,
                    ...winnerPlayer,
                });
                eventService.emit(NODE_EVENT_SERVICE.AUCTION_CLOSED, auctionId);
            } else {
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_ENDED,
                });
            }
            eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE, {
                auctionId: auctionId,
                state: AUCTION_STATE.completed,
            });
        } else {
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_COUNT_DOWN, {
                message: MESSAGES.SOCKET.AUCTION_COUNT_DOWN,
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
    const bidHistory = JSON.parse(
        (await redisClient.get(`${auctionId}:bidHistory`)) as unknown as string
    );
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_RECENT_BID, {
        message: MESSAGES.SOCKET.AUCTION_RECENT_BID,
        data: bidHistory[bidHistory.length - 1],
    });
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_BIDS, {
        message: MESSAGES.SOCKET.RECENT_BIDS,
        data: bidHistory.slice(-10),
        auctionId,
    });
};

/**
 * @description - create a bid transaction if player wallet balance greater than auction consumed bid value othrewise return false
 * @param playload - playload containing player ID and socket Id and auction Id
 * @returns {Promise<void>}
 */
export const bidTransaction = async (playload: {
    playerId: string;
    socketId: string;
    auctionId: string;
}) => {
    const isBalance = await userService.getPlayerWalletBalance(
        playload.playerId
    );
    const auctionData = JSON.parse(
        (await redisClient.get(
            `auction:live:${playload.auctionId}`
        )) as unknown as string
    );
    const data = isBalance.data as unknown as { play_balance: number };
    if (data.play_balance >= auctionData.plays_consumed_on_bid) {
        const bidHistory = JSON.parse(
            (await redisClient.get(
                `${playload.auctionId}:bidHistory`
            )) as unknown as string
        );
        if (
            bidHistory &&
            bidHistory.length * auctionData.bid_increment_price +
                auctionData.opening_price >=
                auctionData.products.price
        ) {
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.AUCTION_ENDED,
            });
        } else {
            const bidNumber = bidHistory ? bidHistory.length + 1 : 1;
            const bidPrice = bidHistory
                ? bidHistory.length * auctionData.bid_increment_price +
                  auctionData.opening_price +
                  auctionData.bid_increment_price
                : auctionData.bid_increment_price + auctionData.opening_price;
            await userQueries.createBidtransaction({
                player_id: playload.playerId,
                plays: auctionData.plays_consumed_on_bid,
            });
            socket.playerSocket
                .to(playload.socketId)
                .emit(SOCKET_EVENT.AUCTION_CURRENT_PLAYS, {
                    message: MESSAGES.SOCKET.CURRENT_PLAYS,
                    play_balance:
                        data.play_balance - auctionData.plays_consumed_on_bid,
                });
            return { status: true, bidNumber, bidPrice };
        }
    }
    return { status: false };
};

export const selectRandomBidClient = async function selectRandomBidClient(auction_id: string) {
    const bidBotCollection = await bidBotQueries.bidBotCollection(auction_id);
    return bidBotCollection.length > 0 ? bidBotCollection[Math.floor(Math.random() * bidBotCollection.length)] : null;
  };
  
  export const executeBidbot = async function (
    botData: IBidBotData,
    bidBotId: string,
    socketId: string
  ) {
    const playsProvided = Number(await redisClient.get(`BidBotCount:${botData.player_id}:${botData.auction_id}`));
  
    if (!playsProvided) {
      socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_ERROR, { message: "plays invalid" });
      return;
    }
    if (playsProvided <= 0) {
      socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: "plays limit reached" });
      return;
    }
  
    let randomClient = await selectRandomBidClient(botData.auction_id);
    const bidHistory = JSON.parse(await redisClient.get(`${botData.auction_id}:bidHistory`) as string);
  
    if (bidHistory && bidHistory[bidHistory.length - 1]?.player_id === randomClient?.player_id) {
        randomClient = await selectRandomBidClient(botData.auction_id);
    }
  
    // const randomTime = Math.floor(Math.random() * ( 5 - 1)) + 1;
    // console.log(countdowns[botData.auction_id], "+ ", randomTime);
    const randomTime = Math.floor(Math.random() * 5) + 1;
    if (countdowns[botData.auction_id] === randomTime) {
      newBiDRecieved({
        player_id: botData.player_id,
        auction_id: botData.auction_id,
        player_name: botData.player_name,
        profile_image: botData.profile_image,
        remaining_seconds: countdowns[botData.auction_id] as number,
        player_bot_id: randomClient?.id,
      }, socketId);
  
      const auctionRunning = JSON.parse(await redisClient.get(`auction:live:${botData.auction_id}`) as string);
      const playsUpdated = (playsProvided - auctionRunning.plays_consumed_on_bid) as number;
      await redisClient.set(`BidBotCount:${botData.player_id}:${botData.auction_id}`, `${playsUpdated}`);
    }
  
    const isActive = countdowns[botData.auction_id];
    if (!isActive) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: "auction not active" });
    } else {
        executeBidbot(botData, bidBotId, socketId);
    }
  };
  
  export const bidByBotRecieved = async (botData: IBidBotData, socketId: string) => {
    const isActive = countdowns[botData.auction_id];
    if (!isActive) {
      socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: "auction not active" });
      return;
    }
  
    const wallet = await userQueries.playerWalletBac(botData.player_id);
    if ((wallet?.play_balance as number) < botData.plays_limit) {
      socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, { message: "wallet balance insufficient" });
      return;
    }
  
    const data = await redisClient.get(`BidBotCount:${botData.player_id}:${botData.auction_id}`);
    const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id, botData.auction_id);
  
    let insertBidBot = null;
    if (!existBot) {
      insertBidBot = await bidBotService.addBidBot(botData);
    }
  
    if (!data?.length) {
      await redisClient.set(`BidBotCount:${botData.player_id}:${botData.auction_id}`, `${botData.plays_limit}`);
    }
  
    executeBidbot(botData, insertBidBot as string, socketId);
  };
  