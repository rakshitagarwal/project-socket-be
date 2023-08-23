import { MESSAGES, NODE_EVENT_SERVICE } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import referralQueries from "./referral-queries";
import userQueries from "../users/user-queries";
import { PrismaClient } from "@prisma/client";
import eventService from "../../utils/event-service";

const addReferral = async (player_id: string, player_referral_id: string, prisma: PrismaClient) => {
    if (!player_referral_id) return;
    const dbData = {
        player_id: player_id,
        player_referral_id: player_referral_id,
    };
    await referralQueries.addReferral(dbData, prisma);
};

const getReferral = async (player_id: string) => {
    const result = await referralQueries.getReferral(player_id);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, result);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const referralCheck = async (player_id: string) => {
    const result = await referralQueries.getReferral(player_id);
    if (result?.status) {
        const transactions = await userQueries.playerPlaysBalance(player_id);
        const referralConfig = await referralQueries.referralConfig();
        if (referralConfig) {
            if (((transactions[0]?.play_balance as number) >= referralConfig?.credit_plays) as unknown as number) {
                const player_ids = [result.player_id, result.player_referral_id];
                await Promise.all(player_ids.map(async (player_id) => {
                    await referralQueries.addPlaysByReferral(referralConfig.reward_plays, player_id);
                    const balance = await referralQueries.getReferral(player_id);
                    eventService.emit(NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_CREDITED, {
                        player_id: player_id,
                        plays_balance: balance });
                    }));
                await referralQueries.updateReferral(result.player_id);
            }
        }
    }
};

const updateReferral = async (player_id: string) => {
    const result = await referralQueries.updateReferral(player_id);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS,result);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const updateReferralConfig = async (data: {reward_plays: number, credit_plays: number}) => {
    const { reward_plays, credit_plays } = data;
    const result = await referralQueries.updateReferralConfig(reward_plays, credit_plays);
    if (result) return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

const referralService = {
    addReferral,
    getReferral,
    updateReferral,
    referralCheck,
    updateReferralConfig,
};

export default referralService;
