import { MESSAGES, NODE_EVENT_SERVICE } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import referralQueries from "./referral-queries";
import userQueries from "../users/user-queries";
import eventService from "../../utils/event-service";
import { ReferralConfig } from "./typings/referral.type";
import { PrismaClient } from "@prisma/client";

/**
 * @description getReferral is used to give details of referral and its details
 * @param {string} player_id - player id to check referral details
 * @returns {object} - the response object using responseBuilder.
 */
const getReferral = async (player_id: string) => {
    const result = await referralQueries.getReferral(player_id);
    if (result)
        return responseBuilder.okSuccess(
            MESSAGES.REFERRAL.REFERRAL_FOUND,
            result
        );
    return responseBuilder.notFoundError(MESSAGES.REFERRAL.REFERRAL_NOT_FOUND);
};

/**
 * @description referralCheck is where the condition to give extra plays is checked
 * @param {string} player_id - player id to check referral config
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 */
const referralCheck = async (player_id: string, prisma: PrismaClient) => {
    const result = await referralQueries.getReferralPrisma(prisma, player_id);
    if (!result?.status) return false;

    const [transactionSum, referralConfig] = await Promise.all([
        userQueries.creditTransactions(player_id, prisma),
        referralQueries.referralConfigPrisma(prisma),
    ]);
    if (!referralConfig || !transactionSum) return false;
    const credits = transactionSum[0];

    if (
        (credits?.credit_sum as number) >= referralConfig.credit_plays
    ) {
        const player_ids = [result.player_id, result.player_referral_id];
        await Promise.all(
            player_ids.map(async (id) => {
                await referralQueries.addPlaysByReferral(
                    id,
                    referralConfig.reward_plays,
                    prisma
                );
                const balance = await userQueries.userPlaysBalance(id, prisma);
                const userBlx = balance[0];
                eventService.emit(
                    NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_CREDITED,
                    {
                        player_id: id,
                        plays_balance: parseInt((userBlx?.play_balance as number).toString()) || 0,
                    }
                );
            })
        );
        await referralQueries.updateReferral(result.player_id, prisma);
        return true;
    }
    return false;
};

/**
 * @description referralConfig give details set for referral logic
 * @returns {object} - the response object using responseBuilder.
 */
const referralConfig = async () => {
    const result = await referralQueries.referralConfig();
    if (result)
        return responseBuilder.okSuccess(
            MESSAGES.REFERRAL.REFERRAL_CONFIG_FOUND,
            result
        );
    return responseBuilder.notFoundError(
        MESSAGES.REFERRAL.REFERRAL_CONFIG_NOT_FOUND
    );
};

/**
 * @description updateReferralConfig is used to update configuration for referral code.
 * @param {ReferralConfig} data - data containing config is passed
 * @returns {object} - the response object using responseBuilder.
 */
const updateReferralConfig = async (data: ReferralConfig) => {
    const check = Object.keys(data);
    if (!check.length)
        return responseBuilder.notFoundError(
            MESSAGES.REFERRAL.REFERRAL_CONFIG_NOT_UPDATED
        );
    const result = await referralQueries.updateReferralConfig(data);
    if (result)
        return responseBuilder.okSuccess(
            MESSAGES.REFERRAL.REFERRAL_CONFIG_UPDATED,
            result
        );
    return responseBuilder.notFoundError(
        MESSAGES.REFERRAL.REFERRAL_CONFIG_NOT_UPDATED
    );
};

const referralService = {
    getReferral,
    referralCheck,
    referralConfig,
    updateReferralConfig,
};

export default referralService;
