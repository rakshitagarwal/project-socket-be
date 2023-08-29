import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { ReferralConfig, ReferralData } from "./typings/referral.type";

/**
 * @description addReferral is used to add referral and its details
 * @param {ReferralData} referralData - data which contains ids of users
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns {queryResult} - the result of execution of query.
 */
const addReferral = async function (
    referralData: ReferralData,
    prisma: PrismaClient
) {
    const queryResult = await prisma.userReferral.create({
        data: referralData,
    });
    return queryResult;
};

/**
 * @description addPlaysByReferral is used to add plays when checks are valid
 * @param {string} player_id - it contains the player id to whom extra plays are given in transaction
 * @param {number} plays - it contains the number of plays to be given in the transaction
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns {queryResult} - the result of execution of query.
 */
const addPlaysByReferral = async function (player_id: string, plays: number, prisma: PrismaClient) {
    const queryResult = await prisma.playerWalletTransaction.create({
        data: {
            play_credit: plays,
            spend_on: "REFERRAL_PLAYS",
            created_by: player_id,
        },
    });
    return queryResult;
};

/**
 * @description getReferral is used to give details of referral and its status
 * @param {string} player_id - it contains the player id to find if referral is available
 * @returns {queryResult} - the result of execution of query.
 */
const getReferral = async function (player_id: string) {
    const queryResult = await db.userReferral.findFirst({
        where: { player_id },
    });
    return queryResult;
};

/**
 * @description updateReferral is used to update referral and its status
 * @param {string} player_id - it contains the player id to find if referral is available
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns {queryResult} - the result of execution of query.
 */
const updateReferral = async function (player_id: string, prisma: PrismaClient) {
    const query = await prisma.userReferral.findFirst({
        where: { player_id },
    });
    const queryResult = await prisma.userReferral.update({
        where: { id: query?.id },
        data: {
            status: false,
            is_deleted: true,
            updated_at: new Date(),
        },
    });
    return queryResult;
};

/**
 * @description referralConfig is used to give referral configuration
 * @returns {queryResult} - the result of execution of query.
 */
const referralConfig = async function () {
    const queryResult = await db.referral.findFirst();
    return queryResult;
};

/**
 * @description updateReferralConfig is used to give updated configuration of referral code
 * @param {ReferralConfig} configData - it contains how many plays to be rewarded and whats the credit limit
 * @returns {queryResult} - the result of execution of query.
 */
const updateReferralConfig = async function (configData: ReferralConfig) {
    const query = await db.referral.findFirst();
    const queryResult = await db.referral.update({
        where: { id: query?.id as string},
        data: configData,
    });
    return queryResult;
};

const referralQueries = {
    addReferral,
    addPlaysByReferral,
    getReferral,
    updateReferral,
    referralConfig,
    updateReferralConfig,
};

export default referralQueries;
