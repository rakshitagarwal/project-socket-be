import { db } from "../../config/db";
import { ReferralData } from "./typings/referral.type";

const addReferral = async function (referralData: ReferralData) {
    const queryResult = await db.userReferral.create({
        data: referralData
    });
    return queryResult;
};

const getReferral = async function (player_id: string) {
    const queryResult = await db.userReferral.findFirst({
        where: { player_id: player_id }
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

const referralConfig = async function() {
    const queryResult = await db.referral.findMany();
    return queryResult[0];
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
    referralConfig,
    updateReferralConfig,
};

export default referralQueries;
