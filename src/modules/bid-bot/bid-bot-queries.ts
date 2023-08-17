import { db } from "../../config/db";
import { IBidBotData } from "./typings/bid-bot-types";

/**
 * @description addbidBot is used to add bidbot information to the database.
 * @param {IBidBotInfo} bidBodData - All info related to bidbpt is passed using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const addBidBot = async function (bidBodData: IBidBotData) {
    const queryResult = await db.bidBot.create({
        data: bidBodData,
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            plays_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

/**
 * @description addBidBotMany is used to add all bidbot information to the database.
 * @param {IBidBotInfo} bidBodData - All info related to bidbpt is passed using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const addBidBotMany = async function (bidBodData: IBidBotData[]) {
    const queryResult = await db.bidBot.createMany({
        data: bidBodData
    });
    return queryResult;
};

/**
 * @description getByAuctionAndPlayerId is used to retrieve the bid bot based on its id.
 * @param {string} player_id - The id of player is passed here using this variable
 * @param {string} auction_id - The id of auction is passed here using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const getByAuctionAndPlayerId = async function (player_id: string, auction_id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { player_id: player_id, auction_id: auction_id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            plays_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

/**
 * @description getBidBotByAuctionId is used to retrieve the bid bot based on the auction id.
 * @param {string} id - The id of auction is passed here using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const getBidBotByAuctionId = async function (id: string) {
    const queryResult = await db.bidBot.findMany({
        where: { auction_id: id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            plays_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

/**
 * @description getBidBotByPlayerId is used to retrieve the bid bot based on the player id.
 * @param {string} id - The id of player is passed here using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const getBidBotByPlayerId = async function (id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { player_id: id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            plays_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

/**
 * @description getBidBotByAuctionId is used to retrieve the bid bot based on its id.
 * @param {string} id - The id of bidbot is passed here using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const getBidBotById = async function (id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { id: id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            plays_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};


const bidBotQueries = {
    addBidBot,
    addBidBotMany,
    getByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
    getBidBotById,
};

export default bidBotQueries;
