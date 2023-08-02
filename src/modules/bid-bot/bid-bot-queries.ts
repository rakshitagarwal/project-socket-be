import { db } from "../../config/db";
import { IBidBotInfo } from "./typings/bid-bot-types";

/**
 * @description addbidBot is used to add bidbot information to the database.
 * @param {IBidBotInfo} bidBodData - All info related to bidbpt is passed using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const addBidBot = async function (bidBodData: IBidBotInfo) {
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
 * @description bidBotCollection is used to retrieve all bidbots with plays more than 0.
 * @returns {queryResult} - the result of execution of query.
 */
const bidBotCollection = async function () {
    const queryResult = await db.bidBot.findMany({
        select: {
          id: true,
          player_id: true,
          auction_id: true,
          plays_limit: true,
          total_bot_bid: true,
          is_active: true,
          created_at: true,
        },
        where: {
          plays_limit: {
            gt: 0,
          },
        },
      });
      return queryResult;
};

/**
 * @description getByAuctionAndPlayerId is used to retrieve the bid bot based on its id.
 * @param {string} id1 - The id of player is passed here using this variable
 * @param {string} id2 - The id of auction is passed here using this variable
 * @returns {queryResult} - the result of execution of query.
 */
const getByAuctionAndPlayerId = async function (id1: string, id2: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { player_id: id1, auction_id: id2 },
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

const bidBotQueries = {
    addBidBot,
    bidBotCollection,
    getByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
    getBidBotById,
    updateBidBot,
};

export default bidBotQueries;
