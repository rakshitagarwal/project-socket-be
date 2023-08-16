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

/**
 * @description updateBidBot is used to update bid limit entry of one bidbot.
 * @param {string} id - The id of bidbot is passed here using this variable
 * @param {number} bidsUpdated - The bid limit to be updated is passed using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const updateBidBot = async function (id: string, bidsUpdated: number) {
    const queryResult = await db.bidBot.update({
        where: { id },
        data: { plays_limit: bidsUpdated },
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
 * @description updateBidBotMany is used to update total_bot_bid of bidbot.
 * @param {IBidBotData} bidBotData - data required to update total_bot_bid type definition
 * @returns {queryResult} - the result of execution of query.
 */
const updateBidBotMany = async function (bidBotData: IBidBotData) {
    const query = await db.bidBot.findFirst({
        where: { player_id: bidBotData.player_id, auction_id: bidBotData.auction_id },
        select: { total_bot_bid: true },
    });

    const queryResult = await db.bidBot.updateMany({
        where: { player_id: bidBotData.player_id, auction_id: bidBotData.auction_id },
        data: { 
            total_bot_bid: bidBotData.total_bot_bid + Number(query?.total_bot_bid),
            is_active: false,
            price_limit:bidBotData.price_limit
        },
    });
    return queryResult;
};

/**
 * @description updateBidBotDeactivate is used to update total_bot_bid of bidbot.
 * @param {string} id - unique id to find one particular bot
 * @param {number} total_bot_bid - updation of total_bot_bid after deactivation
 * @returns {queryResult} - the result of execution of query.
 */
const updateBidBotDeactivate = async function (id:string, total_bot_bid: number,price_limit:number) {
    const queryResult = await db.bidBot.update({
        where: { id: id },
        data: { 
            total_bot_bid: total_bot_bid,
            is_active: false,
            price_limit
        },
    });
    return queryResult;
};

const bidBotQueries = {
    addBidBot,
    getByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
    getBidBotById,
    updateBidBot,
    updateBidBotMany,
    updateBidBotDeactivate
};

export default bidBotQueries;
