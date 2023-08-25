import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { ReferralData } from "./typings/referral.type";

const addReferral = async function (referralData: ReferralData, prisma: PrismaClient) {
    const queryResult = await prisma.userReferral.create({
        data: referralData
    });
    return queryResult;
};

const addPlaysByReferral = async function (plays: number, player_id: string) {
    const queryResult = await db.playerWalletTx.create({
        data: {
            play_credit: plays,
            spend_on: "REFERRAL_PLAYS",
            created_by: player_id,
        }
    });
    return queryResult;
}

const getReferral = async function (player_id: string) {
    const queryResult = await db.userReferral.findFirst({
        where: { player_id }
    });
    return queryResult;
}

const updateReferral = async function (player_id: string) {
    const query = await db.userReferral.findFirst({
        where: { player_id }
    });
    const queryResult = await db.userReferral.update({
        where: { id: query?.id },
        data: {
            status: false,
            is_deleted: true,
            updated_at: new Date(),
        }
    });
    return queryResult;
}

const referralConfig = async function () {
    const queryResult = await db.referral.findFirst();    
    return queryResult;
}

const updateReferralConfig = async function (id: string, reward_plays: number, credit_plays: number) {
    const queryResult = await db.referral.update({
        where: { id },
        data: { reward_plays, credit_plays },
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
