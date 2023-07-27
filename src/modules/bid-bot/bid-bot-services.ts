// import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotInfo, IUpdate } from "./typings/bid-bot-types";

const addbidBot = async (botData: IBidBotInfo) => {
    const result = await bidBotQueries.addBidBot(botData as IBidBotInfo);
    if (result) return responseBuilder.createdSuccess("bid bot created successfully", result);
    return responseBuilder.badRequestError("bid bot creation failed");
};

const getBidBotByAuctionId = async (id: string) => {
    if (id) {
        const result = await bidBotQueries.getBidBotByAuctionId(id);
        if (result) return responseBuilder.okSuccess("bid bot found successfully", result);
        return responseBuilder.notFoundError("bid bot not found");
    }
    return responseBuilder.notFoundError("bid bot not found");
};

const getBidBotByPlayerId = async (id: string) => {
    if (id) {
        const result = await bidBotQueries.getBidBotByPlayerId(id);
        if (result) return responseBuilder.okSuccess("bid bot found successfully", result);
        return responseBuilder.notFoundError("bid bot not found");
    }
    return responseBuilder.notFoundError("bid bot not found");
};

const updateBidBot = async (id: string, data: IUpdate) => {
    const existBot = await bidBotQueries.getBidBotById(id);
    if (existBot) {
        const { bid_limit } = data;
        const result = await bidBotQueries.updateBidBot(id, bid_limit);
        if (result) return responseBuilder.okSuccess("bid bot updated successfully", result);
    }
    return responseBuilder.notFoundError("bid bot not found");
};

const bidBotService = {
    addbidBot,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};

export default bidBotService;
