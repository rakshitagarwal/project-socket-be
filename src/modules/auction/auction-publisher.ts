import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import { bidRequestValidator } from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import {
    IBidAuction,
    IMinMaxAuction,
    IminMaxResult,
} from "../../middlewares/typings/middleware-types";
import eventService, { auctionClosed } from "../../utils/event-service";
import {
    NODE_EVENT_SERVICE,
    MESSAGES,
    SOCKET_EVENT,
} from "../../common/constants";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import userQueries from "../users/user-queries";
import logger from "../../config/logger";
import { auctionQueries } from "./auction-queries";
import { auctionService } from "./auction-services";
import { Bid } from "./typings/auction-types";
import { IminAuctionBidLog } from "../users/typings/user-types";

const socket = global as unknown as AppGlobal;
const countdowns: { [auctionId: string]: number } = {}; // Countdown collection
const BidBotCountDown: { [auctionId: string]: number } = {};
/**
 * Starts the auction with the given auctionId.
 * @param {string} auctionId - The ID of the auction to start.
 * @returns {void}
 */

export const auctionStart = (auctionId: string) => {
    countdowns[auctionId] = 11;
    /**
     * Timer function that runs every second during the auction.
     * @async
     * @returns {Promise<void>}
     */
    async function timerRunEverySecond() {
        if (
            auctionId !== "undefined" &&
            countdowns[auctionId] !== undefined &&
            (countdowns[auctionId] as number) <= 0
        ) {
            delete countdowns[auctionId];
            const bidHistory = JSON.parse(
                (await redisClient.get(
                    `${auctionId}:bidHistory`
                )) as unknown as string
            );
            if (bidHistory) {
                const winnerPlayer = bidHistory[bidHistory.length - 1];
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_WINNER,
                    ...winnerPlayer,
                });
            } else {
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
                    message: MESSAGES.SOCKET.AUCTION_ENDED,
                    auctionId,
                });
            }
            eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE, {
                auctionId: auctionId,
                state: AUCTION_STATE.completed,
            });
            await auctionClosed(auctionId);
            logger.log({
                level: "warn",
                message: `auction ended ${auctionId}`,
            });
        } else {
            countdowns[auctionId] = (countdowns[auctionId] as number) - 1;
            socket.playerSocket.emit(SOCKET_EVENT.AUCTION_COUNT_DOWN, {
                message: MESSAGES.SOCKET.AUCTION_COUNT_DOWN,
                count: countdowns[auctionId],
                auctionId,
            });
            eventService.emit(NODE_EVENT_SERVICE.SIMULATION_BOTS, {
                auction_id: auctionId,
                count: countdowns[auctionId],
            });
            eventService.emit(
                NODE_EVENT_SERVICE.COUNTDOWN,
                countdowns[auctionId],
                auctionId
            ); //emit live countdown
            setTimeout(timerRunEverySecond, 1000);
        }
    }
    timerRunEverySecond();
};

/**
 * @description find avatars of active or recent bidders from auction bid history.
 * @param {Bid[]} bidHistory - the bidhistory is passed to find unique bidders and their avatars
 * @param {string} auctionId - The ID of the auction which is concerned when state is live
 */
const activeAvatars = async (bidHistory: Bid[], auctionId: string) => {
    let avatarUnique: Bid[];
    if (!bidHistory?.length || bidHistory === null) {
        avatarUnique = [];
    } else {
        avatarUnique = bidHistory.reduce((uniqueBids: Bid[], bid: Bid) => {
            const foundIndex = uniqueBids.findIndex(
                (item) => item.player_id === bid.player_id
            );
            if (foundIndex === -1) {
                uniqueBids.push({
                    player_name: bid.player_name,
                    player_id: bid.player_id,
                    profile_image: bid.profile_image,
                });
            }
            return uniqueBids;
        }, []);
    }
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_AVATARS, {
        message: MESSAGES.SOCKET.ACTIVE_PLAYERS,
        data: avatarUnique,
        auction_id: auctionId,
    });
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

    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_RECENT_BID, {
        message: MESSAGES.SOCKET.AUCTION_RECENT_BID,
        data: bidHistory[bidHistory.length - 1],
        auctionId,
    });
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_BIDS, {
        message: MESSAGES.SOCKET.RECENT_BIDS,
        data: bidHistory.slice(-30).reverse(),
        auctionId,
    });

    await activeAvatars(bidHistory, auctionId);
};

/**
 * @description - create a bid transaction if player wallet balance greater than auction consumed bid value othrewise return false
 * @param payload - payload containing player ID and socket Id and auction Id
 * @returns {Promise<void>}
 */
const bidTransaction = async (payload: {
    playerId: string;
    socketId: string;
    auctionId: string;
    bidHistoryData: string;
}) => {
    const [balanceInfo, auctionInfo] = await Promise.all([
        redisClient.get("player:plays:balance"),
        redisClient.get(`auction:live:${payload.auctionId}`),
    ]);
    console.log(
        ">>>>>>>>>>>>>>>>>>>>",
        balanceInfo,
        "++++++++++++++++++++++++"
    );
    console.log(
        ">>>>>>>>>>>>>>>>>>>>",
        auctionInfo,
        "------------------------"
    );
    if ((!balanceInfo && !auctionInfo) || auctionInfo === null) {
        return { status: false };
    }
    const isBalance = JSON.parse(balanceInfo || ("" as string));
    const auctionData = JSON.parse(auctionInfo || ("" as string));
    if (isBalance[`${payload.playerId}`] < auctionData.plays_consumed_on_bid) {
        return { status: false };
    }
    const bidHistory = JSON.parse(
        (await redisClient.get(
            `${payload.auctionId}:bidHistory`
        )) as unknown as string
    );
    if (
        bidHistory &&
        bidHistory.length * auctionData.bid_increment_price +
            auctionData.opening_price >=
            auctionData.products.price
    ) {
        countdowns[`${payload.auctionId}`] = 0;
        socket.playerSocket.emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.AUCTION_ENDED,
            auction_id: payload.auctionId,
        });
        return { status: false };
    }
    const bidNumber = bidHistory ? bidHistory.length + 1 : 1;
    const bidPrice = bidHistory
        ? bidHistory.length * auctionData.bid_increment_price +
          auctionData.opening_price +
          auctionData.bid_increment_price
        : auctionData.bid_increment_price + auctionData.opening_price;
    socket.playerSocket
        .to(payload.socketId)
        .emit(SOCKET_EVENT.AUCTION_CURRENT_PLAYS, {
            message: MESSAGES.SOCKET.CURRENT_PLAYS,
            play_balance:
                isBalance[payload.playerId] - auctionData.plays_consumed_on_bid,
        });
    eventService.emit(NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_DEBIT, {
        player_id: payload.playerId,
        plays_balance: auctionData.plays_consumed_on_bid,
        auction_id: payload.auctionId,
    });
    return {
        status: true,
        bidNumber,
        bidPrice: parseFloat(bidPrice.toFixed(2)),
    };
};

const auctionBidderHistory = async (
    bidderPayload: IBidAuction,
    socketId: string,
    type: string,
    bidHistoryData = ""
) => {
    const isBalance = await bidTransaction({
        playerId: bidderPayload.player_id,
        socketId,
        auctionId: bidderPayload.auction_id,
        bidHistoryData,
    });
    if (isBalance.status && countdowns[bidderPayload.auction_id]) {
        const newBidData = {
            ...bidderPayload,
            bid_price: isBalance.bidPrice,
            bid_number: isBalance.bidNumber,
        };
        countdowns[newBidData.auction_id] = 11;
        if (type === "new_bid_history_set") {
            await redisClient.set(
                `${newBidData.auction_id}:bidHistory`,
                JSON.stringify([{ ...newBidData, created_at: new Date() }])
            );
            recentBid(newBidData.auction_id);
            return;
        }
        const newbidHistory = JSON.parse(bidHistoryData);
        newbidHistory.push({ ...newBidData, created_at: new Date() });
        await redisClient.set(
            `${newBidData.auction_id}:bidHistory`,
            JSON.stringify(newbidHistory)
        );
        recentBid(newBidData.auction_id);
        return;
    }
    socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
        message: MESSAGES.SOCKET.INSUFFICIENT_PLAYS_BALANCED,
        auction_id: bidderPayload.auction_id,
    });
    return;
};

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
        socket.playerSocket
            .to(socketId)
            .emit(SOCKET_EVENT.AUCTION_ERROR, { ...isValid });
        return;
    }
    const { bidData } = isValid;
    const isAuction = countdowns[bidData.auction_id];
    if (!isAuction) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.AUCTION_NOT_FOUND,
            auction_id: bidData.auction_id,
        });
        return;
    }

    const auctionExist = JSON.parse(
        (await redisClient.get(
            `auction:live:${bidPayload.auction_id}`
        )) as string
    );
    if (!auctionExist?.is_preRegistered) {
        const playerExist = await auctionQueries.checkPlayerExistAuction(
            bidPayload.auction_id,
            bidPayload.player_id
        );
        if (!playerExist) {
            await auctionService.playerOpenAuctionRegister({
                auction_id: bidPayload.auction_id,
                player_id: bidPayload.player_id,
            });
        }
    }

    const isPre_register = await redisClient.get(
        `auction:pre-register:${bidData.auction_id}`
    );
    if (!isPre_register) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
            player_id: bidPayload.player_id,
            auction_id: bidPayload.auction_id,
            status: false,
        });
        return;
    }
    const preRegisterData = JSON.parse(isPre_register);
    if (!preRegisterData[`${bidData.auction_id + bidData.player_id}`]) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
            player_id: bidPayload.player_id,
            auction_id: bidData.auction_id,
            status: false,
        });
        return;
    }
    const isBidHistory = await redisClient.get(
        `${bidData.auction_id}:bidHistory`
    );
    const existingBotData = JSON.parse(
        (await redisClient.get(
            `BidBotCount:${bidPayload.auction_id}`
        )) as string
    );
    if (existingBotData) {
        if (existingBotData[`${bidPayload.player_id}`]) {
            const player_bot = existingBotData[`${bidPayload.player_id}`];
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {
                message: player_bot.is_active
                    ? MESSAGES.BIDBOT.BIDBOT_ACTIVE
                    : MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                auction_id: player_bot.auction_id,
                player_id: player_bot.player_id,
                plays_limit: player_bot.plays_limit,
                price_limit: player_bot?.price_limit,
                status: player_bot.is_active,
            });
        } else {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.BIDBOT_STATUS, {
                message: MESSAGES.BIDBOT.BIDBOT_NOT_ACTIVE,
                auction_id: bidPayload.auction_id,
                player_id: bidPayload.player_id,
                status: false,
            });
        }
    }
    if (!isBidHistory) {
        return auctionBidderHistory(
            bidData,
            socketId,
            "new_bid_history_set",
            ""
        );
    }
    const iscontinue = JSON.parse(isBidHistory);
    if (iscontinue[iscontinue.length - 1].player_id === bidData.player_id) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.CONTINUE_BID_NOT_ALLOWED,
            auction_id: bidData.auction_id,
        });
        return;
    }
    return auctionBidderHistory(
        bidData,
        socketId,
        "new_bid_history_update",
        isBidHistory
    );
};

/**
 * @description create the random bid for the simulations
 * @param {string} auction_id
 * @param {number} count
 */
export const randomBid = async (auction_id: string, count: number) => {
    if (!BidBotCountDown[auction_id]) {
        BidBotCountDown[auction_id] = Math.floor(Math.random() * (10 - 6)) + 3;
    }
    if (BidBotCountDown[auction_id] === count && count > 1) {
        const usersbots = await userQueries.getRandomBot();
        if (!usersbots) return;
        const randomIndex = Math.floor(Math.random() * (usersbots.length - 1));
        let bot = usersbots[randomIndex];
        const isContinueBids = JSON.parse(
            (await redisClient.get(`${auction_id}:bidHistory`)) as string
        );
        if (isContinueBids?.length) {
            const lastBids = isContinueBids[isContinueBids.length - 1];
            if (lastBids.player_id === bot?.id) {
                const isFilteredBots = usersbots.filter(
                    (bot) => bot.id !== lastBids.player_id
                );
                const randomIndex = Math.floor(
                    Math.random() * (usersbots.length - 1)
                );
                bot = isFilteredBots[randomIndex];
            }
        }
        if (bot && count > 0) {
            const botData: IBidAuction = {
                auction_id: auction_id,
                player_id: bot.id,
                player_name: bot.first_name as unknown as string,
                profile_image: bot.avatar as unknown as string,
                remaining_seconds: count,
            };
            await newBiDRecieved(botData, bot.id);
        }
        BidBotCountDown[auction_id] = Math.floor(Math.random() * (10 - 6)) + 3;
    }
};
////////////////////////////////////////////  min max auction step //////////////////////////////////////////
/**
 * Stores auction result information in Redis, emits socket events, and updates auction state if necessary.
 * @param {IminMaxResult} payload - The payload containing auction result data.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */

/**
 * slice is used for latest 30 data
 */
const minMaxResultInfo = async (payload: IminMaxResult) => {
    await redisClient.set(
        `auction:result:${payload.auction_id}`,
        JSON.stringify(payload.finalData)
    );
    socket.playerSocket.emit(SOCKET_EVENT.AUCTION_MIN_MAX_PERCENTAGE, {
        message: "Total Bids",
        data: {
            total_bids: payload.totalBid,
            num_of_bids: payload.bidHistory.length,
            player_id: payload.player_id,
            auction_id: payload.auction_id,
            bid_percentage:
                Math.floor(
                    (payload.bidHistory.length * 100) / payload.totalBid
                ) > 100
                    ? 100
                    : Math.floor(
                          (payload.bidHistory.length * 100) / payload.totalBid
                      ),
        },
    });
    socket.playerSocket.to(payload.socketId).emit("player:info:min:max", {
        message: "Player Bidlogs",
        player_id: payload.player_id,
        auction_id: payload.auction_id,
        data: payload.playerInfo.reverse().slice(0, 30),
    });
    socket.playerSocket.to(payload.socketId).emit("min:max:recent:bid", {
        message: "Bid Added Successfully",
        player_id: payload.player_id,
        auction_id: payload.auction_id,
    });
    if (payload.winnerInfo && payload.bidHistory.length >= payload.totalBid) {
        socket.playerSocket.emit(SOCKET_EVENT.AUCTION_WINNER, {
            message: MESSAGES.SOCKET.AUCTION_WINNER,
            auction_id: payload.auction_id,
            winnerInfo: payload.winnerInfo,
        });
        eventService.emit(NODE_EVENT_SERVICE.MIN_MAX_AUCTION_END, {
            auction_id: payload.auction_id,
            winnerInfo: payload.winnerInfo,
        });
        eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE, {
            auctionId: payload.auction_id,
            state: AUCTION_STATE.completed,
        });
    }
};

/**
 * Calculate the maximum bid in an auction, identify winners, and call the minMaxResultInfo function to store and broadcast the results.
 * @param {IMinMaxAuction[]} bidHistory - The array of bid history objects.
 * @param {string} socketId - The socket ID of the auction.
 * @param {number} totalBid - The total number of bids.
 * @param {string} auction_id - The ID of the auction.
 * @param {string} player_id - The ID of the player.
 * @returns {void}
 */
const maxAuction = async (
    bidHistory: IMinMaxAuction[],
    socketId: string,
    totalBid: number,
    auction_id: string,
    player_id: string
) => {
    const highestValue = [...bidHistory].sort(
        (a, b) => b.bid_price - a.bid_price
    )[0];
    const group: { [bid_prices: string]: number } = {};
    const lowest: { [bid_prices: string]: number } = {};
    for (const i of bidHistory) {
        if (group[`${i.bid_price}`]) {
            group[`${i.bid_price}`] = (group[`${i.bid_price}`] as number) + 1;
            delete lowest[`${i.bid_price}`];
        } else {
            group[`${i.bid_price}`] = 1;
            lowest[`${i.bid_price}`] = 1;
        }
    }
    const sortHighestValue = Object.keys(lowest).sort((a, b) => +b - +a);
    let winnerInfo: undefined | IMinMaxAuction;
    const playerInfo: IMinMaxAuction[] = [];
    const finalData = bidHistory.map((val) => {
        val.is_unique = group[val.bid_price] === 1 ? true : false;
        val.is_highest =
            `${val.bid_price}` === `${sortHighestValue[0]}` ||
            `${val.bid_price}` === highestValue?.bid_price + ""
                ? true
                : false;
        if (val.is_highest && val.is_unique) {
            winnerInfo = val;
        }
        if (val.player_id === player_id) {
            playerInfo?.push(val);
        }
        return val;
    });
    minMaxResultInfo({
        auction_id,
        player_id,
        winnerInfo,
        playerInfo,
        bidHistory,
        totalBid,
        finalData,
        socketId,
    });
};

/**
 * Calculate the minimum bid in an auction, identify winners, and call the minMaxResultInfo function to store and broadcast the results.
 * @param {IMinMaxAuction[]} bidHistory - The array of bid history objects.
 * @param {string} socketId - The socket ID of the auction.
 * @param {number} totalBid - The total number of bids.
 * @param {string} auction_id - The ID of the auction.
 * @param {string} player_id - The ID of the player.
 * @returns {void}
 */
const minAuction = async (
    bidHistory: IMinMaxAuction[],
    socketId: string,
    totalBid: number,
    auction_id: string,
    player_id: string
) => {
    const lowestValue = [...bidHistory].sort(
        (a, b) => a.bid_price - b.bid_price
    )[0];
    const group: { [bid_prices: string]: number } = {};
    const lowest: { [bid_prices: string]: number } = {};
    for (const i of bidHistory) {
        if (group[`${i.bid_price}`]) {
            group[`${i.bid_price}`] = (group[`${i.bid_price}`] as number) + 1;
            delete lowest[`${i.bid_price}`];
        } else {
            group[`${i.bid_price}`] = 1;
            lowest[`${i.bid_price}`] = 1;
        }
    }
    const sortlowestValue = Object.keys(lowest).sort((a, b) => +a - +b);
    let winnerInfo: undefined | IMinMaxAuction;
    const playerInfo: IMinMaxAuction[] = [];
    const finalData = bidHistory.map((val) => {
        val.is_unique = group[val.bid_price] === 1 ? true : false;
        val.is_lowest =
            `${val.bid_price}` === `${sortlowestValue[0]}` ||
            `${val.bid_price}` === lowestValue?.bid_price + ""
                ? true
                : false;
        if (val.is_lowest && val.is_unique) {
            winnerInfo = val;
        }
        if (val.player_id === player_id) {
            playerInfo?.push(val);
        }
        return val;
    });
    minMaxResultInfo({
        auction_id,
        player_id,
        winnerInfo,
        playerInfo,
        bidHistory,
        totalBid,
        finalData,
        socketId,
    });
};

/**
 * Perform a minimum-maximum bid transaction in an auction, update player balances, and store bid history.
 * @param {IMinMaxAuction} payload - The payload containing bid transaction data.
 * @param {string} socketId - The socket ID for communication.
 * @returns {Promise<{ status: boolean }>} A Promise that resolves to an object with a `status` property indicating the success of the transaction.
 */
const minMaxTransaction = async (payload: IMinMaxAuction, socketId: string) => {
    const [balanceInfo, auctionInfo] = await Promise.all([
        redisClient.get("player:plays:balance"),
        redisClient.get(`auction:live:${payload.auction_id}`),
    ]);
    if (!balanceInfo && !auctionInfo) {
        return { status: false };
    }
    const isBalance = JSON.parse(balanceInfo || ("" as string));
    const auctionData = JSON.parse(auctionInfo || ("" as string));
    if (isBalance[`${payload.player_id}`] < auctionData.plays_consumed_on_bid) {
        return { status: false };
    }
    socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_CURRENT_PLAYS, {
        message: MESSAGES.SOCKET.CURRENT_PLAYS,
        play_balance:
            isBalance[payload.player_id] - auctionData.plays_consumed_on_bid,
    });
    eventService.emit(NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_DEBIT, {
        player_id: payload.player_id,
        plays_balance: auctionData.plays_consumed_on_bid,
        auction_id: payload.auction_id,
    });
    const auctionHistory = await redisClient.get(
        `${payload.auction_id}:bidHistory`
    );
    payload.created_at = new Date();
    if (!auctionHistory || !auctionHistory.length) {
        await redisClient.set(
            `${payload.auction_id}:bidHistory`,
            JSON.stringify([payload])
        );
    } else {
        const historyData = JSON.parse(auctionHistory as string);
        historyData.push(payload);
        await redisClient.set(
            `${payload.auction_id}:bidHistory`,
            JSON.stringify(historyData)
        );
    }
    return { status: true };
};

/**
 * Process a bid in a minimum-maximum auction, validate the bid, update player balances, and handle auction logic based on the category type.
 * @param {string} socketId - The socket ID for communication.
 * @param {IMinMaxAuction} bidData - The bid data to process.
 * @returns {void}
 */
export const minMaxAuctionBid = async (
    socketId: string,
    bidData: IMinMaxAuction
) => {
    const isValid = await bidRequestValidator<IMinMaxAuction>(
        bidData,
        auctionSchemas.ZMinMaxAuction
    );
    if (!isValid.status) {
        socket.playerSocket
            .to(socketId)
            .emit(SOCKET_EVENT.AUCTION_ERROR, { ...isValid });
        return;
    }
    const isAuctionLive = JSON.parse(
        (await redisClient.get(`auction:live:${bidData.auction_id}`)) as string
    );
    if (!isAuctionLive) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.AUCTION_NOT_LIVE,
            auction_id: bidData.auction_id,
        });
        return;
    }
    if (
        bidData.bid_price <= isAuctionLive.opening_price ||
        bidData.bid_price >= isAuctionLive.products.price
    ) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: `Your Bid Must Be Greater Than ${isAuctionLive.opening_price} And Less Than ${isAuctionLive.products.price}`,
            auction_id: bidData.auction_id,
        });
        return;
    }
    const decimalPlayes = bidData.bid_price.toString().split(".")?.[1];
    if (bidData.bid_price.toString().includes(".") && decimalPlayes) {
        if (decimalPlayes.toString()?.length > isAuctionLive.decimal_count) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: `Decimal Value Must Be Of ${isAuctionLive.decimal_count} Digits`,
                auction_id: bidData.auction_id,
            });
            return;
        }
    }
    let isPlayerRegister = false;
    if (isAuctionLive.is_preRegistered) {
        const isPre_register = await redisClient.get(
            `auction:pre-register:${bidData.auction_id}`
        );
        if (!isPre_register) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
                player_id: bidData.player_id,
                auction_id: bidData.auction_id,
            });
            return;
        }
        const preRegisterData = JSON.parse(isPre_register);
        if (!preRegisterData[`${bidData.auction_id + bidData.player_id}`]) {
            socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.USER_NOT_REGISTERED,
                auction_id: bidData.auction_id,
            });
            return;
        }
    } else {
        const playerExist = await auctionQueries.checkPlayerExistAuction(
            bidData.auction_id,
            bidData.player_id
        );
        if (!playerExist) {
            const isUser = await userQueries.fetchPlayerId(bidData.player_id);
            if (!isUser) {
                socket.playerSocket
                    .to(socketId)
                    .emit(SOCKET_EVENT.AUCTION_ERROR, {
                        message: MESSAGES.USERS.USER_NOT_FOUND,
                        auction_id: bidData.auction_id,
                    });
                return;
            }
            isPlayerRegister = true;
        }
    }

    const isBalance = await minMaxTransaction(bidData, socketId);
    if (!isBalance?.status) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {
            message: MESSAGES.SOCKET.INSUFFICIENT_PLAYS_BALANCED,
            auction_id: bidData.auction_id,
        });
        return;
    }
    if (isPlayerRegister) {
        eventService.emit(NODE_EVENT_SERVICE.REGISTER_NEW_PLAYER, bidData);
    }
    const auctionHistory = JSON.parse(
        (await redisClient.get(`${bidData.auction_id}:bidHistory`)) as string
    );

    await activeAvatars(auctionHistory, bidData.auction_id);

    const cotegory_type = isAuctionLive.auctionCategory.code;
    if (cotegory_type === "MIN") {
        minAuction(
            auctionHistory,
            socketId,
            +isAuctionLive.total_bids,
            bidData.auction_id,
            bidData.player_id
        );
        return;
    }
    if (cotegory_type === "MAX") {
        maxAuction(
            auctionHistory,
            socketId,
            +isAuctionLive.total_bids,
            bidData.auction_id,
            bidData.player_id
        );
        return;
    }
};

/**
 * Retrieve and emit the minimum-maximum auction results for a specific player and auction to a socket.
 * @param {Object} payload - The payload containing auction and player information.
 * @param {string} payload.auction_id - The ID of the auction.
 * @param {string} payload.player_id - The ID of the player.
 * @param {string} payload.socketId - The socket ID for communication.
 * @returns {void}
 */
export const getMinMaxAuctionResult = async (payload: {
    auction_id: string;
    player_id: string;
    socketId: string;
}) => {
    const isAuctionLive = JSON.parse(
        (await redisClient.get(`auction:live:${payload.auction_id}`)) as string
    );
    if (!isAuctionLive) {
        socket.playerSocket
            .to(payload.socketId)
            .emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.AUCTION_NOT_LIVE,
                auction_id: payload.auction_id,
            });
        return;
    }
    const auctionResult = JSON.parse(
        (await redisClient.get(
            `auction:result:${payload.auction_id}`
        )) as string
    );
    if (!auctionResult) {
        socket.playerSocket.to(payload.socketId).emit("player:info:min:max", {
            message: "Player Bidlogs",
            data: {
                player_id: payload.player_id,
                auction_id: payload.auction_id,
                data: [],
            },
        });
        return;
    }
    const playerData = auctionResult.filter(
        (data: IMinMaxAuction) => data.player_id === payload.player_id
    );
    socket.playerSocket.to(payload.socketId).emit("player:info:min:max", {
        message: "Player Bidlogs",
        player_id: payload.player_id,
        auction_id: payload.auction_id,
        data: playerData.reverse().slice(0, 30),
    });
    return;
};

export const minMaxBidResult = async (payload: {
    auction_id: string;
    player_id: string;
    socketId: string;
}) => {
    const isAuctionLive = JSON.parse(
        (await redisClient.get(`auction:live:${payload.auction_id}`)) as string
    );
    if (!isAuctionLive) {
        socket.playerSocket
            .to(payload.socketId)
            .emit(SOCKET_EVENT.AUCTION_ERROR, {
                message: MESSAGES.SOCKET.AUCTION_NOT_LIVE,
                auction_id: payload.auction_id,
            });
        return;
    }
    const auctionHistory = JSON.parse(
        (await redisClient.get(`${payload.auction_id}:bidHistory`)) as string
    );

    await activeAvatars(auctionHistory, payload.auction_id);

    if (auctionHistory) {
        socket.playerSocket
            .to(payload.socketId)
            .emit(SOCKET_EVENT.MIN_MAX_BID_PERCENTAGE, {
                message: "Total Bids",
                data: {
                    total_bids: +isAuctionLive.total_bids,
                    num_of_bids: auctionHistory.length || 0,
                    auction_id: payload.auction_id,
                    bid_percentage:
                        Math.floor(
                            (auctionHistory.length * 100) /
                                +isAuctionLive.total_bids
                        ) > 100
                            ? 100
                            : Math.floor(
                                  (auctionHistory.length * 100) /
                                      +isAuctionLive.total_bids
                              ),
                },
            });
    } else {
        socket.playerSocket
            .to(payload.socketId)
            .emit(SOCKET_EVENT.MIN_MAX_BID_PERCENTAGE, {
                message: "Total Bids",
                data: {
                    total_bids: +isAuctionLive.total_bids,
                    num_of_bids: 0,
                    auction_id: payload.auction_id,
                    bid_percentage: 0,
                },
            });
    }
};
/**
 * Retrieves live auction data for a specific player and emits it to the provided socket ID.
 * @param {object} payload - The payload containing player_id for whom live auction data is requested.
 * @param {string} socketId - The ID of the socket to emit the live auction data to.
 * @returns {void}
 * @throws {Error} Throws an error if there is an issue with fetching or processing the live auction data.
 *
 */
export const liveAuctionData = async (
    payload: { player_id: string },
    socketId: string
) => {
    const isValid = await bidRequestValidator(
        { id: payload.player_id },
        auctionSchemas.ZAuctionId
    );
    if (!isValid.status) {
        return;
    }
    const liveAuction = await auctionQueries.getAllLiveAuction(
        payload.player_id
    );
    if (liveAuction?.length) {
        await new Promise((resolve, _reject) => {
            const newPayload: {
                [id: string]: {
                    auction_id: string;
                    auctionCategory: { code: string | null; title: string };
                    title: string;
                    auctionPercentage?: {
                        total_bids: number;
                        no_of_bids: number;
                        bid_percentage: number;
                        auction_id: string;
                    } | null;
                    auctionBidHistory?: {
                        auction_id: string;
                        data: IminAuctionBidLog | null;
                    };
                };
            } = {};
            const liveValues = liveAuction.map(async (val) => {
                if (val.auctionCategory.code !== "TLP" && val.total_bids) {
                    const getBidHistory = JSON.parse(
                        (await redisClient.get(
                            `${val.id}:bidHistory`
                        )) as string
                    );
                    const auctionResult = JSON.parse(
                        (await redisClient.get(
                            `auction:result:${val.id}`
                        )) as string
                    );
                    if (getBidHistory !== null && auctionResult !== null) {
                        const playerData = auctionResult.filter(
                            (data: IMinMaxAuction) =>
                                data.player_id === payload.player_id
                        );
                        newPayload[`${val.id}`] = {
                            auction_id: val.id,
                            auctionCategory: val.auctionCategory,
                            title: val.title,
                            auctionPercentage: {
                                total_bids: val.total_bids || 0,
                                no_of_bids: getBidHistory.length,
                                auction_id: val.id,
                                bid_percentage:
                                    Math.floor(
                                        (getBidHistory.length * 100) /
                                            +val.total_bids
                                    ) > 100
                                        ? 100
                                        : Math.floor(
                                              (getBidHistory.length * 100) /
                                                  +val.total_bids
                                          ),
                            },
                            auctionBidHistory: {
                                auction_id: val.id,
                                data: playerData.length
                                    ? playerData.reverse()[0]
                                    : null,
                            },
                        };
                    } else {
                        newPayload[`${val.id}`] = {
                            auction_id: val.id,
                            auctionCategory: val.auctionCategory,
                            title: val.title,
                            auctionPercentage: {
                                total_bids: val.total_bids || 0,
                                no_of_bids: 0,
                                auction_id: val.id,
                                bid_percentage: 0,
                            },
                            auctionBidHistory: {
                                auction_id: val.id,
                                data: null,
                            },
                        };
                    }
                } else {
                    newPayload[`${val.id}`] = {
                        auction_id: val.id,
                        auctionCategory: val.auctionCategory,
                        title: val.title,
                        auctionPercentage: null,
                        auctionBidHistory: {
                            auction_id: val.id,
                            data: null,
                        },
                    };
                }
                return newPayload[`${val.id}`];
            });
            Promise.all(liveValues)
                .then((result) => {
                    const data = result.reduce((acc, item) => {
                        if (item) {
                            acc[`${item.auction_id}`] = item;
                        }
                        return acc;
                    }, {} as typeof newPayload);

                    socket.playerSocket.to(socketId).emit("auction:grid:data", {
                        message: "Live Auction Data",
                        data,
                    });
                })
                .catch((error) => {
                    logger.error(error);
                    resolve({});
                });
        });
    } else {
        socket.playerSocket.to(socketId).emit("auction:grid:data", {
            message: "Live Auction Data",
            data: {},
        });
    }
};
