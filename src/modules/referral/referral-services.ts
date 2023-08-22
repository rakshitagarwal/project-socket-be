import { ReferralData } from './typings/referral.type';
import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import referralQueries from "./referral-queries";

const addReferral = async (player_id: string, player_referral_id: string) => {
    const dbData = {
        player_id: player_referral_id,
        player_referral_id: player_id,
        status: true,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
    }
    const result = await referralQueries.addReferral(dbData as ReferralData);
    if (result) return responseBuilder.createdSuccess("", result);
    return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_CREATE_FAIL);
};

const getReferral = async (player_id: string) => {
    const result = await referralQueries.getReferral(player_id);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, [result]);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const updateReferral = async (player_id: string) => {
    const result = await referralQueries.updateReferral(player_id);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const updateReferralConfig = async (data: { reward_plays: number, credit_plays: number }) => {
    const { reward_plays, credit_plays } = data;
    const result = await referralQueries.updateReferralConfig(reward_plays, credit_plays);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};


const referralService = {
    addReferral,
    getReferral,
    updateReferral,
    updateReferralConfig,
};

export default referralService;