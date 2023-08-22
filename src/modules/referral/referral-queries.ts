import { db } from "../../config/db";

const addReferralInfo = async function (mediaData: string) {
    const queryResult = await db.userReferral.create({
        data: mediaData,
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

const updateReferralConfig = async function (reward_plays: number, credit_plays: number) {
    const query = await db.referral.findMany();

    const queryResult = await db.referral.update({
        where: { id: query[0]?.id },

        data: { reward_plays, credit_plays },
    });
    return queryResult;
};

const referralQueries = {
    addReferralInfo,
    updateReferralConfig,
};

export default referralQueries;
