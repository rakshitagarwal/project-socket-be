import { MESSAGES, NODE_EVENT_SERVICE } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import referralQueries from "./referral-queries";
import userQueries from "../users/user-queries";
import eventService from "../../utils/event-service";
import { ReferralConfig } from "./typings/referral.type";

/**
 * @description getReferral is used to give details of referral and its details
 * @param {string} player_id - player id to check referral config
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
 * @description referralCheck is where the validation to give extra plays is checked
 * @param {string} player_id - player id to check referral config
 */
const referralCheck = async (player_id: string) => {
    const result = await referralQueries.getReferral(player_id);
    if (result?.status) {
        const transactionSum = await userQueries.creditTransactions(player_id);
        const referralConfig = await referralQueries.referralConfig();

        if (referralConfig && transactionSum) {
            if ((transactionSum[0]?.credit_sum as number) >= referralConfig?.credit_plays) {
                const player_ids = [result.player_id, result.player_referral_id];
                const promises = [];

                for (const id of player_ids) {
                    const promise = (async () => {
                        await referralQueries.addPlaysByReferral(id, referralConfig.reward_plays);
                        const balance = await userQueries.playerPlaysBalance(id);
                        eventService.emit(NODE_EVENT_SERVICE.PLAYER_PLAYS_BALANCE_CREDITED, {
                            player_id: id,
                            plays_balance: parseInt((balance[0]?.play_balance as number).toString()),
                        });
                    })();
                    promises.push(promise);
                }
                await Promise.all(promises);
                await referralQueries.updateReferral(result.player_id);
            }
        }
    }
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
