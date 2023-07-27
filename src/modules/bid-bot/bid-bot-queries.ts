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

const getBidBotById = async function (id: string) {
    const queryResult = await db.bidBot.findFirst({
        where: { id: id },
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

const updateBidBot = async function (id: string, bidsUpdated: number) {
    const queryResult = await db.bidBot.update({
        where: { id },
        data: { bid_limit: bidsUpdated },
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
    getBidBotById,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};

export default bidBotQueries;
