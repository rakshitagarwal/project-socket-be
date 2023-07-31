import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotInfo, IUpdate } from "./typings/bid-bot-types";
import redisClient from "../../config/redis";

/**
 * @description addbidBot is used to add bidbot information to the database.
 * @param {IBidBotInfo} botData - All info related to bidbpt is passed using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const addbidBot = async (botData: IBidBotInfo) => {
    const Data = await redisClient.get(`${botData.auction_id}:bidbot`);
    const oneBidByBot = {playerId: `${botData.player_id}`,limit: `${botData.bid_limit}`,bid_no: 0,};
    if(!Data) {
        await redisClient.set(`${botData.auction_id}:bidbot`, JSON.stringify({[botData.player_id]: oneBidByBot}));
    } else {
        const newData = JSON.parse(Data);
        newData[botData.player_id] = oneBidByBot;
        await redisClient.set(`${botData.auction_id}:bidbot`, JSON.stringify(newData));
    }
    const result = await bidBotQueries.addBidBot(botData as IBidBotInfo);
    if (result) return responseBuilder.createdSuccess(MESSAGES.BIDBOT.BIDBOT_CREATE_SUCCESS, result);
    return responseBuilder.badRequestError(MESSAGES.BIDBOT.BIDBOT_CREATE_FAIL);
};

/**
 * @description getBidBotByAuctionId is used to retrieve the bid bot based on the auction id
 * @param {string} id - The id of auction is passed here using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const getBidBotByAuctionId = async (id: string) => {
    if (id) {
        const result = await bidBotQueries.getBidBotByAuctionId(id);
        if (result) return responseBuilder.okSuccess(MESSAGES.BIDBOT.BIDBOT_FOUND, result);
        return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
};

/**
 * @description getBidBotByPlayerId is used to retrieve the bid bot based on the player id
 * @param {string} id - The id of player is passed here using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const getBidBotByPlayerId = async (id: string) => {
    if (id) {
        const result = await bidBotQueries.getBidBotByPlayerId(id);
        if (result) return responseBuilder.okSuccess(MESSAGES.BIDBOT.BIDBOT_FOUND, result);
        return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
};

/**
 * @description updateBidBot is used to update bid limit entry of one bidbot.
 * @param {string} id - The id of bidbot is passed here using this variable
 * @param {IUpdate} data - The bid limit to be updated of a bidbot is passed using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const updateBidBot = async (id: string, data: IUpdate) => {
    const existBot = await bidBotQueries.getBidBotById(id);
    if (existBot) {
        const { bid_limit } = data;
        const result = await bidBotQueries.updateBidBot(id, bid_limit);
        if (result) return responseBuilder.okSuccess(MESSAGES.BIDBOT.BIDBOT_UPDATE_LIMIT, result);
    }
    return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
};

const bidBotService = {
    addbidBot,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};

export default bidBotService;
