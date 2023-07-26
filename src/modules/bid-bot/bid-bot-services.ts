import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import bidBotQueries from "./bid-bot-queries";
import {IBidBotInfo} from "./typings/bid-bot-types";

const addbidBot = async (reqFileData: IBidBotInfo, userId: string) => {
    // const fileData = {
    //     filename: reqFileData.filename,
    //     type: (reqFileData?.mimetype as string).split('/')[0],
    //     local_path: reqFileData.path,
    //     tag: "media",
    //     mime_type: reqFileData.mimetype,
    //     size: reqFileData.size,
    //     created_by: userId,
    // };
    const data1  = reqFileData;
    const data2 = userId;
    const mediaResult = {data1, data2};
    // await bidBotQueries.addBidBot(fileData as IBidBotQuery);
    if (mediaResult) return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult);
    return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_CREATE_FAIL);
};

const getBidBotByAuctionId = async (mediaId: string | undefined) => {
    if (mediaId) {
        const media = await bidBotQueries.getBidBotByAuctionId(mediaId);
        if (media) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, [media]);
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);

};

const getBidBotByPlayerId = async (mediaId: string | undefined) => {
    if (mediaId) {
        const media = await bidBotQueries.getBidBotByPlayerId(mediaId);
        if (media) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, [media]);
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const updateBidBot = async (id: string) => {
    const media = await bidBotQueries.getBidBotByPlayerId(id);
    if (media) {
        const result = await bidBotQueries.updateBidBot(id, media.is_active);
        return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    }
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};


const mediaServiceProvider = {
    addbidBot,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};

export default mediaServiceProvider;
