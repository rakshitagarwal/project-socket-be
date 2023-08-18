import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData, IFindBidBot } from "./typings/bid-bot-types";

/**
 * @description addBidBot is used to add bidbot information to the database.
 * @param {IBidBotInfo} botData - All info related to bidbpt is passed using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const addBidBot = async (botData: IBidBotData) => {
    const dbEntry = {
        player_id: botData.player_id,
        auction_id: botData.auction_id,
        plays_limit: botData.plays_limit,
        total_bot_bid: 0,
        is_active: true,
    }
    const queryResult = await bidBotQueries.addBidBot(dbEntry);
    if (queryResult) return queryResult.id;
    return responseBuilder.badRequestError(MESSAGES.BIDBOT.BIDBOT_CREATE_FAIL);
};

/**
 * @description getBidBotByAuctionId is used to retrieve the bid bot based on the auction id
 * @param {string} id - The id of auction is passed here using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const getBidBotByAuctionAndPlayerId = async (data: IFindBidBot) => {
    if (data) {
        const { player_id, auction_id } = data;
        const result = await bidBotQueries.getByAuctionAndPlayerId(player_id, auction_id);
        if (result) return responseBuilder.okSuccess(MESSAGES.BIDBOT.BIDBOT_FOUND, result);
        return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.BIDBOT.BIDBOT_NOT_FOUND);
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

const bidBotService = {
    addBidBot,
    getBidBotByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
};

export default bidBotService;
