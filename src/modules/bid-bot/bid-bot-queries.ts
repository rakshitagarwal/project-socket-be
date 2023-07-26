import { db } from "../../config/db";
import { IBidBotInfo } from "./typings/bid-bot-types";

const addBidBot = async function (bidBodData: IBidBotInfo) {
    const queryResult = await db.bidBot.create({
        data: bidBodData,
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            bid_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

const allBots = async function () {
    const queryResult = await db.bidBot.findMany({
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            bid_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

const getBidBotByAuctionId = async function (id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { auction_id: id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            bid_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

const getBidBotByPlayerId = async function (id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { player_id: id },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            bid_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

const updateBidBot = async function (id: string, status: boolean) {
    const queryResult = await db.bidBot.update({
        where: { id },
        data: { is_active: !status },
        select: {
            id: true,
            player_id: true,
            auction_id: true,
            bid_limit: true,
            total_bot_bid: true,
            is_active: true,
            created_at: true,
        },
    });
    return queryResult;
};

const bidBotQueries = {
    addBidBot,
    allBots,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};
export default bidBotQueries;
