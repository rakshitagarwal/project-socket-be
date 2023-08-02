import { Prisma, auctionState, PrismaClient } from "@prisma/client";
import { auctionResultType } from "@prisma/client";

import { db } from "../../config/db";
import {
    IAuction,
    IPagination,
    IPlayerRegister,
    IStartAuction,
} from "./typings/auction-types";
import { Sql } from "@prisma/client/runtime";

const prisma = new PrismaClient();
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
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            start_date: auction.start_date,
            is_preRegistered: auction.is_pregistered,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            terms_and_conditions: auction.terms_condition,
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
    const query = await db.auction.findFirst({
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
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            is_preRegistered: auction.is_pregistered as boolean,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
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
const remove = async (id: string[]) => {
    const query = await db.auction.updateMany({
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
 * @description for the fetching the auction wise logs
 * @param {string} id - auction id
 * @returns
 */
const fetchAuctionLogs = async (id: string) => {
    const query = await db.playerBidLogs.findMany({
        where: {
            auction_id: id,
        },
    });
    return query;
};

/**
 * @description for starting the auction with start_date
 * @param {IStartAuction} data
 * @returns
 */
const startAuction = async (data: IStartAuction) => {
    const query = await db.auction.update({
        where: {
            id: data.auction_id,
        },
        data: {
            start_date: data.start_date,
        },
    });
    return query;
};

/**
 * @description Retrieves a list of upcoming player auctions.
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
            start_date: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            products: {
                select: {
                    price: true,
                },
            },
        },
        orderBy: {
            start_date: "desc",
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
const updateAuctionState = async (auctionId: string, payload: auctionState) => {
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
            player_id: true,
            Auctions: {
                select: {
                    title: true,
                    registeration_fees: true,
                    start_date: true,
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
/**
 * Get upcoming auctions
 * @returns {[Promise<IAuction>]}
 */
// const upcomingPlayerAuctionReminder = async () => {
//     /**
//      * Query the database to fetch upcoming player auctions.
//      * @type {Promise<Array<UpcomingAuctionInfo>>}
//      */
//     const queryResult = await db.auction.findMany({
//         where: {
//             AND: [
//                 {
//                     is_deleted: false,
//                     state: "upcoming",
//                     status: true,
//                 },
//                 {
//                     AND: [
//                         {
//                             registeration_endDate: {
//                                 gte: new Date(
//                                     new Date().getTime() - 36 * 60000
//                                 ),
//                             },
//                         },
//                     ],
//                 },
//             ],
//         },
//         select: {
//             id: true,
//             title: true,
//             state: true,
//             registeration_count: true,
//             is_preRegistered: true,
//             registeration_endDate: true,
//             auction_pre_registeration_startDate: true,
//         },
//         orderBy: {
//             auction_pre_registeration_startDate: "desc",
//         },
//     });
//     return queryResult;
// };

/**
 * Get player auctions registerations count
 * @param {[string]} auctionId - multiple auction ID
 * @returns {[Promise<IAuction>]}
 */
const auctionRegistrationCount = async (auctionId: string) => {
    const queryResult = await db.playerAuctionRegsiter.count({
        where: { auction_id: auctionId },
    });
    return queryResult;
};

interface IPlayerAuctionInfo {
    id: string;
    auction_id: string;
    player_id: string;
    status: boolean;
    title: string;
    total_bids: number;
    bid_increment_price: number;
    plays_consumed_on_bid: number;
    last_bidding_price: number;
}

/**
 * Fetches the player auction information for a given player ID.
 * @param {string} player_id - The ID of the player for whom to fetch auction information.
 * @param {number} offset
 * @param {number} limit
 * @returns {Promise<IPlayerAuctionInfo[]>} A Promise that resolves to an array of PlayerAuctionInfo objects representing the auction information for the player.
 */
const fetchPlayerAuction = async (
    player_id: string,
    offset: number,
    limit: number
) => {
    const query: Sql = Prisma.sql`
      SELECT
        T2.player_id,
        T2.auction_id,
        T1.total_bids,
        T2.created_at,
        T2.status,
        T2.title,
        T2.bid_increment_price,
        T2.plays_consumed_on_bid,
        T2.id,
        T1.bid_price as last_bidding_price,
        (T1.total_bids * T2.plays_consumed_on_bid) as total_bid_consumed
      FROM
        (select player_bid_log_T1.player_id,player_bid_log_T1.auction_id,player_bid_log_T1.total_bids,player_bid_log_T2.bid_price from (SELECT
            player_id,
                auction_id,
                COUNT(*) AS total_bids
              FROM
                player_bid_log
              GROUP BY
                player_id,
                auction_id) as player_bid_log_T1 left join player_bid_log as player_bid_log_T2 on player_bid_log_T1.player_id=player_bid_log_T2.player_id and player_bid_log_T1.auction_id=player_bid_log_T2.auction_id
                order by player_bid_log_T2.created_at desc limit 1) as T1
      RIGHT JOIN
        (SELECT
          T3.title,
          T3.bid_increment_price,
          T3.plays_consumed_on_bid,
          T4.created_at,
          T4.auction_id,
          T4.player_id,
          T4.status,
          T4.id
        FROM
          player_auction_register as T4
        INNER JOIN
          auctions as T3
        ON
          T3.id = T4.auction_id
        ) as T2
      ON
        T1.auction_id = T2.auction_id
      AND
        T1.player_id = T2.player_id
      WHERE
        T2.player_id = ${player_id}
      ORDER BY
        T2.created_at DESC
        offset ${offset}
        limit ${limit}
    `;

    const queryResult = await prisma.$queryRaw<IPlayerAuctionInfo[]>(query);
    return queryResult;
};

/**
 * Updates the registration status of players in a specific auction.
 * @param {string} auction_id - The ID of the auction.
 * @param {auctionResultType} status - The updated status for the players in the auction.
 * @returns {Promise<any>} A Promise that resolves to the query result after updating the player registration status.
 */

const updatePlayerRegistrationAuctionStatus = async (
    auction_id: string,
    status: auctionResultType
) => {
    const queryResult = await db.playerAuctionRegsiter.updateMany({
        where: { auction_id },
        data: { status },
    });
    return queryResult;
};

/**
 * Updates the registration status of players in an auction result.
 * @param {string} auction_id - The ID of the auction.
 * @param {string} player_id - The ID of the player.
 * @returns {Promise<{ lostQueryResult: any, wonQueryResult: any }>} An object containing the query results for "lost" and "won" updates.
 */

const updatePlayerRegistrationAuctionResultStatus = async (
    auction_id: string,
    player_id: string
) => {
    const lostexpirationTime: Date = new Date(new Date().getTime() + 1800000);
    const winexpirationTime: Date = new Date();
    winexpirationTime.setDate(new Date().getDate() + 2);
    const lostQueryResult = await db.playerAuctionRegsiter.updateMany({
        where: { AND: [{ auction_id }, { NOT: { player_id } }] },
        data: { status: "lost", buy_now_expiration: lostexpirationTime },
    });
    const wonQueryResult = await db.playerAuctionRegsiter.updateMany({
        where: { auction_id, player_id },
        data: { status: "won", buy_now_expiration: winexpirationTime },
    });
    return { lostQueryResult, wonQueryResult };
};
/**
 * Retrieves auction registration details for a specific player in a given auction.
 * @async
 * @param {string} player_id - The ID of the player for whom auction registration details are to be retrieved.
 * @param {string} auction_id - The ID of the auction for which registration details are to be retrieved.
 * @returns {Promise<Object|null>} - A Promise that resolves to an object containing auction registration details, or null if not found.

 */
const getplayerRegistrationAuctionDetails = async (
    player_id: string,
    auction_id: string
) => {
    const queryResult = await db.playerAuctionRegsiter.findFirst({
        where: { player_id, auction_id },
        select: {
            id: true,
            auction_id: true,
            player_id: true,
            status: true,
            buy_now_expiration: true,
            Auctions: {
                select: {
                    title: true,
                    plays_consumed_on_bid: true,
                    description: true,
                    product_id: true,
                    products: {
                        select: {
                            medias: true,
                            price: true,
                            landing_image: true,
                        },
                    },
                },
            },
            PlayerBidLogs: {
                orderBy: {
                    created_at: "desc",
                },
            },
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
    fetchAuctionLogs,
    upcomingPlayerAuction,
    updateAuctionState,
    totalCountRegisterAuctionByAuctionId,
    getUpcomingAuctionById,
    playerAuctionRegistered,
    checkIfPlayerExists,
    playerRegistrationAuction,
    auctionRegistrationCount,
    startAuction,
    fetchPlayerAuction,
    updatePlayerRegistrationAuctionStatus,
    updatePlayerRegistrationAuctionResultStatus,
    getplayerRegistrationAuctionDetails,
};
