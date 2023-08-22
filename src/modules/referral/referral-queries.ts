import { db } from "../../config/db";
import { ReferralData } from "./typings/referral.type";

const addReferral = async function (referralData: ReferralData) {
    const queryResult = await db.userReferral.create({
        data: referralData,
        select: {
            id: true,
            player_id: true,
            player_referral_id: true,
            status: true,
            is_deleted: true,
            created_at: true,
            updated_at: true,
        },
    });
    return queryResult;
};

const getReferral = async function (player_id: string) {
    const queryResult = await db.userReferral.findFirst({
        where: { id: player_id }
    });
    return queryResult;
}

const updateReferral = async function (player_id: string) {
    const queryResult = await db.userReferral.update({
        where: { id : player_id },
        data: {
            status: false,
            is_deleted: true,
            updated_at: new Date(),
        }
    });
    return queryResult;
}

const updateReferralConfig = async function (reward_plays: number, credit_plays: number) {
    const query = await db.referral.findMany();

    const queryResult = await db.referral.update({
        where: { id: query[0]?.id },
        data: { reward_plays, credit_plays },
    });
    return queryResult;
};

const referralQueries = {
    addReferral,
    getReferral,
    updateReferral,
    updateReferralConfig,
};

export default referralQueries;
