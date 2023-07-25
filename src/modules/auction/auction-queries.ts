import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import {
    IAuction,
    IPagination,
    IPlayerRegister,
} from "./typings/auction-types";

/**
 * Auction Creation
 * @param {IAuction} auction - values regarding the auction data
 * @param {string} userId = UUID regarding the created_by
 * @returns {Promise<{id: string}>}
 */
const create = async (auction: IAuction, userId: string) => {
    const query = await db.auction.create({
        data: {
            title: auction.title,
            description: auction.description as string,
            bid_increment_price: auction.price_increment,
            opening_price: auction.opening_price,
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            start_date: auction.start_date,
            is_preRegistered: auction.is_pregistered,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            registeration_endDate: auction.pre_registeration_endDate,
            auction_pre_registeration_startDate:
                auction.auction_pre_registeration_startDate,
            terms_and_conditions: auction.terms_condition,
            state: auction.auction_state,
            created_by: userId,
        },
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * Get Active Auction By Id
 * @param {string} id - auction id
 * @returns {Promise<IAuction>}
 */
const getActiveAuctioById = async (id: string) => {
    const query = await db.auction.findFirst({
        where: {
            id,
            is_deleted: false,
            status: true,
        },
        select: {
            id: true,
            title: true,
            description: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            new_participants_limit: true,
            start_date: true,
            registeration_count: true,
            registeration_fees: true,
            terms_and_conditions: true,
            status: true,
            registeration_endDate: true,
            auction_pre_registeration_startDate: true,
            is_preRegistered: true,
            state: true,
            auctionCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            products: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return query;
};

/**
 * Get multiple auctions
 * @param {[string]} id - multiple auction ID
 * @returns {[Promise<IAuction>]}
 */
const getMultipleActiveById = async (id: string[]) => {
    const query = await db.auction.findMany({
        where: {
            AND: {
                id: {
                    in: id,
                },
                is_deleted: false,
            },
        },
    });
    return query;
};

/**
 * Auction Retrieve
 * @description retrieval of all auctions
 * @returns - all auction entities
 */
const getAll = async (query: IPagination) => {
    const queryCount = await db.auction.count({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter },
            ],
        },
    });
    const queryResult = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter },
            ],
        },
        take: +query.limit,
        skip: +query.page * +query.limit,
        select: {
            id: true,
            title: true,
            description: true,
            state: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            new_participants_limit: true,
            start_date: true,
            is_preRegistered: true,
            registeration_count: true,
            registeration_fees: true,
            registeration_endDate: true,
            auction_pre_registeration_startDate: true,
            terms_and_conditions: true,
            auctionCategory: true,
            products: true,
            status: true,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return { queryResult, queryCount };
};

/**
 * Auction Update By Id with Transaction
 * @param {PrismaClient} prisma - prisma for db transaction
 * @param {IAuction} auction - auction Data
 * @param {string} auctionId - auction Id
 * @param {string} userId - user Id
 * @returns {Promise<IAuction>}
 */
const update = async (
    auction: IAuction & {
        status: boolean;
    },
    auctionId: string,
    userId: string
) => {
    const query = await db.auction.update({
        where: {
            id: auctionId,
        },
        data: {
            title: auction.title,
            description: auction.description,
            bid_increment_price: auction.price_increment,
            opening_price: auction.opening_price,
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            start_date: auction.start_date,
            is_preRegistered: auction.is_pregistered as boolean,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            registeration_endDate: auction.pre_registeration_endDate,
            auction_pre_registeration_startDate:
                auction.auction_pre_registeration_startDate,
            terms_and_conditions: auction.terms_condition,
            state: auction.auction_state,
            created_by: userId,
            status: auction.status,
        },
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * Remove Auction By ID
 * @param {string} id - Auction ID
 * @returns {Promise<IAuction>} - return the auction detials
 */
const remove = async (prisma: PrismaClient, id: string[]) => {
    const query = await prisma.auctions.updateMany({
        where: {
            AND: {
                id: {
                    in: id,
                },
                is_deleted: false,
            },
        },
        data: {
            is_deleted: true,
        },
    });
    return query;
};

/**
 * Retrieves a list of upcoming player auctions.
 * @returns {Promise<Array<UpcomingAuctionInfo>>} The list of upcoming player auctions.
 */
const upcomingPlayerAuction = async () => {
    /**
     * Query the database to fetch upcoming player auctions.
     * @type {Promise<Array<UpcomingAuctionInfo>>}
     */
    const queryResult = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                    state: "upcoming",
                    status: true,
                },
            ],
        },
        select: {
            id: true,
            title: true,
            state: true,
            registeration_count: true,
            is_preRegistered: true,
            registeration_endDate: true,
            auction_pre_registeration_startDate: true,
            bid_increment_price:true,
            plays_consumed_on_bid:true,
            opening_price:true,
            products:{
                select:{
                    price:true
                }
            }
        },
        orderBy: {
            auction_pre_registeration_startDate: "desc",
        },
    });
    return queryResult;
};

/**
 * Updates the state of an auction with the given auctionId.
 * @param {string} auctionId - The ID of the auction to update.
 * @param {string} payload - The new state to set for the auction.
 * @returns {Promise<Auction>} The updated auction object.
 */
const updateAuctionState = async (auctionId: string, payload: string) => {
    const queryResult = await db.auction.update({
        data: { state: payload },
        where: { id: auctionId },
    });
    return queryResult;
};

/**
 * Retrieves the total count of players registered for an auction by the given auction ID.
 * @param {string} auctionId - The ID of the auction to retrieve the count for.
 * @returns {Promise<number>} The total count of players registered for the auction.
 */
const totalCountRegisterAuctionByAuctionId = async (auctionId: string) => {
    const count = await db.playerAuctionRegsiter.count({
        where: { auction_id: auctionId },
    });
    return count;
};

/* /GET Upcoming auction by ID
 * @param {string} id - auction id
 * @returns auction detials
 */

const getUpcomingAuctionById = async (id: string) => {
    const query = await db.auction.findFirst({
        where: {
            id,
            state: "upcoming",
            is_deleted: false,
            status: true,
        },
    });
    return query;
};

/**
 * @description registered the player for the auction.
 * @param {IPlayerRegister} data
 * @returns
 */
const playerAuctionRegistered = async (data: IPlayerRegister) => {
    const query = await db.playerAuctionRegsiter.create({
        data: data,
    });
    return query;
};

/**
 * @description verify if player doesn't register again in same auction.
 * @param {string} id
 */
const checkIfPlayerExists = async (id: string, auctionId: string) => {
    const query = await db.playerAuctionRegsiter.findMany({
        where: {
            player_id: id,
            auction_id: auctionId,
        },
    });
    return query;
};

/**
 * @description fetch the player auction registration information
 * @param {string} auction_id
 */
const playerRegistrationAuction = async (auction_id: string) => {
    const query = await db.playerAuctionRegsiter.findMany({
        where: {
            auction_id,
        },
        select: {
            Auctions: {
                select: {
                    title: true,
                    auction_pre_registeration_startDate: true,
                },
            },
            User: {
                select: {
                    email: true,
                },
            },
        },
    });
    return query;
};

const upcomingPlayerAuctionReminder = async () => {
    /**
     * Query the database to fetch upcoming player auctions.
     * @type {Promise<Array<UpcomingAuctionInfo>>}
     */
    const queryResult = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                    state: "upcoming",
                    status: true,
                },
                {
                    AND: [
                        {
                            registeration_endDate:{gte :new Date(new Date().getTime() - 36 * 60000)}
                        }
                    ],
                },
            ],
        },
        select: {
            id: true,
            title: true,
            state: true,
            registeration_count: true,
            is_preRegistered: true,
            registeration_endDate: true,
            auction_pre_registeration_startDate: true
        },
        orderBy: {
            auction_pre_registeration_startDate: "desc",
        },
    });
    return queryResult;
};
export const auctionQueries = {
    create,
    getAll,
    getActiveAuctioById,
    update,
    remove,
    getMultipleActiveById,
    upcomingPlayerAuction,
    updateAuctionState,
    totalCountRegisterAuctionByAuctionId,
    getUpcomingAuctionById,
    playerAuctionRegistered,
    checkIfPlayerExists,
    playerRegistrationAuction,
    upcomingPlayerAuctionReminder
};
