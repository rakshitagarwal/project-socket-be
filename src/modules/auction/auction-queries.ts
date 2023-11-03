import {
    Prisma,
    auctionState,
    PrismaClient,
    Currency,
    currencyType,
} from "@prisma/client";
import { auctionResultType } from "@prisma/client";

import { db } from "../../config/db";
import {
    IAuction,
    IAuctionListing,
    IAuctionTotal,
    IAuctionTotalCount,
    IPagination,
    IPlayerAuctionInfo,
    IPlayerRegister,
    IPurchase,
    IStartAuction,
    ITotalAuctionInfo,
} from "./typings/auction-types";
import { Sql } from "@prisma/client/runtime";
import { AUCTION_STATE } from "../../utils/typing/utils-types";
import { prismaTransaction } from "../../utils/prisma-transactions";
import logger from "../../config/logger";

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
            is_preRegistered: auction?.is_pregistered || false,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            terms_and_conditions: auction.terms_condition,
            created_by: userId,
            total_bids: auction.total_bids || 0,
            decimal_count: auction.decimal_count || 0,
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
        include: {
            _count: {
                select: {
                    PlayerAuctionRegister: true,
                },
            },
            products: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    medias: true,
                    productMedias: {
                        select: {
                            medias: true,
                        },
                    },
                },
            },
            auctionCategory: true,
        },
    });

    return query;
};

/**
 * Get Auction By Id
 * @param {string} id - auction id
 * @returns {Promise<IAuction>}
 */
const getAuctionById = async (id: string) => {
    const query = await db.auction.findFirst({
        where: {
            id,
            is_deleted: false,
            status: true,
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

const getAllAuctions = async () => {
    const queryResult = await db.auction.findMany({
        where: {
            is_deleted: false,
            status: true,
            AND: [
                {
                    OR: [
                        {
                            state: "live",
                        },
                        {
                            state: "upcoming",
                        },
                    ],
                },
            ],
        },
    });
    return queryResult;
};

/**
 * Auction Retrieve
 * @description retrieval of all auctions
 * @returns - all auction entities
 */
const getAll = async (query: IPagination) => {
    let orderBy = {};
    if (query._sort === "category") {
        orderBy = { auctionCategory: { title: query._order } };
    } else if (query._sort) orderBy = { [`${query._sort}`]: query._order };

    const queryCount = await db.auction.count({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { AND: query.filter },
            ],
        },
    });
    const queryResult = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { AND: query.filter },
            ],
        },
        include: {
            products: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    medias: true,
                    productMedias: {
                        select: {
                            medias: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    PlayerAuctionRegister: true,
                },
            },
            auctionCategory: true,
        },
        take: +query.limit,
        skip: +query.page * +query.limit,
        orderBy: orderBy,
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
            decimal_count: auction.decimal_count,
            total_bids: auction.total_bids,
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
const fetchAuctionLogs = async (
    id: string,
    option: { limit: number; page: number }
) => {
    const query = await db.playerBidLogs.findMany({
        where: {
            auction_id: id,
        },
        orderBy: {
            created_at: "desc",
        },
        take: option.limit,
        skip: option.page * option.limit,
    });
    const count = await db.playerBidLogs.count({ where: { auction_id: id } });
    return { query, count };
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
        select: {
            id: true,
            registeration_count: true,
            PlayerAuctionRegister: {
                include: {
                    _count: true,
                },
            },
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
                    start_date: {
                        gte: new Date(new Date().getTime() - 1 * 62000),
                    },
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
            total_bids: true,
            decimal_count: true,
            opening_price: true,
            auctionCategory: {
                select: {
                    code: true,
                    title: true,
                },
            },
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
        data: { state: payload, updated_at: new Date() },
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
 * @description findPlayersRegistered is used to find players registered to the auction
 * @param {string} auction_id - id to uniquely identify the auction
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns queryResult - return the result of the query
 */
const findPlayersRegistered = async (
    auction_id: string,
    prisma: PrismaClient
) => {
    const queryResult = await prisma.playerAuctionRegister.findMany({
        where: { auction_id },
        select: {
            player_id: true,
            User: { select: { email: true } },
        },
    });

    await prisma.playerAuctionRegister.updateMany({
        where: {
            auction_id,
        },
        data: {
            status: "cancelled",
        },
    });
    return queryResult;
};

/**
 * @description registered the player in open auction.
 * @param {{auction_id: string, player_id: string}} data
 * @returns
 */
const playerOpenAuctionRegister = async (data: {
    auction_id: string;
    player_id: string;
}) => {
    const query = await db.playerAuctionRegsiter.create({
        data: { ...data, status: "live" },
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
                },
            },
            User: {
                select: {
                    email: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
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
    const query: Sql = Prisma.sql`SELECT 
    T1.auction_id,
    T1.player_id,
    T1.status,
    T2.title,
    T2.plays_consumed_on_bid,
    T2.bid_increment_price,
    T1.created_at,
    COUNT(T3.player_id) as total_bids,
    COUNT(T3.player_id) * T2.plays_consumed_on_bid as total_bid_consumed,
    COALESCE( CASE 
        WHEN T5.code = 'TLP'
         THEN (
			 SELECT MAX(T4.bid_price) 
            FROM player_bid_log as T4 
            WHERE 
            T4.auction_id=T1.auction_id
        )
        ELSE (
			SELECT T4.bid_price 
              FROM player_bid_log as T4 
            WHERE 
             T4.auction_id=T1.auction_id 
            AND T4.is_unique 
            AND (T4.is_highest OR T4.is_lowest)
        )
    END,0)
    AS last_bidding_price
FROM 
    player_auction_register as T1 
INNER JOIN 
    auctions as T2 ON T1.auction_id = T2.id
LEFT JOIN 
	master_auction_categories as T5 on T2.auction_category_id=T5.id
LEFT JOIN 
    player_bid_log as T3 ON T1.auction_id = T3.auction_id AND T1.player_id = T3.player_id
WHERE 
    T1.player_id = ${player_id}
GROUP BY 
    T1.auction_id,
    T1.player_id,
    T1.status,
    T2.title,
    T2.plays_consumed_on_bid,
    T2.bid_increment_price,
    T1.created_at,
	T5.code
ORDER BY T1.created_at DESC
    offset ${offset * limit}
 limit ${limit}`;
    const count = await db.playerAuctionRegsiter.count({
        where: { player_id: player_id },
    });

    //     const query: Sql = Prisma.sql`
    //     SELECT
    //     T5.auction_id,
    //     T5.player_id,
    //     T5.status,
    //     T5.total_bids,
    //     T5.title,
    //     T5.created_at,
    //     T5.id,
    //     T5.bid_increment_price,
    //     T5.plays_consumed_on_bid,
    //     T5.total_bid_consumed,
    //     MAX(T5.last_bidding_price) as last_bidding_price
    //   FROM (
    //     SELECT
    //       T2.player_id,
    //       T2.auction_id,
    //       T1.total_bids,
    //       T2.created_at,
    //       T2.status,
    //       T2.title,
    //       T2.bid_increment_price,
    //       T2.plays_consumed_on_bid,
    //       T2.id,
    //       T1.bid_price as last_bidding_price,
    //       (T1.total_bids * T2.plays_consumed_on_bid) as total_bid_consumed
    //     FROM (
    //       SELECT
    //         player_bid_log_T1.player_id,
    //         player_bid_log_T1.auction_id,
    //         player_bid_log_T1.total_bids,
    //         player_bid_log_T2.bid_price
    //       FROM (
    //         SELECT
    //           player_id,
    //           auction_id,
    //           COUNT(*) AS total_bids
    //         FROM
    //           player_bid_log
    //         where player_bid_log.player_id=${player_id}
    //         GROUP BY
    //           player_id,auction_id ) as player_bid_log_T1
    //       LEFT JOIN player_bid_log as player_bid_log_T2
    //       ON player_bid_log_T1.player_id = player_bid_log_T2.player_id
    //       AND player_bid_log_T1.auction_id = player_bid_log_T2.auction_id
    //       ORDER BY player_bid_log_T2.created_at
    //     ) as T1
    //     RIGHT JOIN (
    //       SELECT
    //         T3.title,
    //         T3.bid_increment_price,
    //         T3.plays_consumed_on_bid,
    //         T4.created_at,
    //         T4.auction_id,
    //         T4.player_id,
    //         T4.status,
    //         T4.id
    //       FROM
    //         player_auction_register as T4
    //       INNER JOIN auctions as T3
    //       ON T3.id = T4.auction_id
    //     ) as T2
    //     ON T1.auction_id = T2.auction_id
    //     AND T1.player_id = T2.player_id
    //   ) as T5
    //   where T5.player_id=${player_id}
    //   GROUP BY T5.auction_id, T5.player_id, T5.status,T5.total_bids,T5.created_at,T5.title,T5.id ,T5.bid_increment_price,T5.plays_consumed_on_bid,T5.total_bid_consumed
    //   order by T5.created_at desc
    //   offset ${offset}
    //       limit ${limit};
    //     `;

    const queryResult = await prisma.$queryRaw<IPlayerAuctionInfo[]>(query);
    return { queryResult, count };
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
    const resultTransactions = await prismaTransaction(
        async (prisma: PrismaClient) => {
            const lostQueryResult =
                await prisma.playerAuctionRegister.updateMany({
                    where: { AND: [{ auction_id }, { NOT: { player_id } }] },
                    data: {
                        status: "lost",
                        buy_now_expiration: lostexpirationTime,
                    },
                });
            const wonQueryResult =
                await prisma.playerAuctionRegister.updateMany({
                    where: { auction_id, player_id },
                    data: {
                        status: "won",
                        buy_now_expiration: winexpirationTime,
                    },
                });
            return { lostQueryResult, wonQueryResult };
        }
    );

    return resultTransactions;
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
            payment_status: true,
            Auctions: {
                select: {
                    title: true,
                    plays_consumed_on_bid: true,
                    description: true,
                    product_id: true,
                    auctionCategory: {
                        select: {
                            id: true,
                            title: true,
                            code: true,
                            status: true,
                        },
                    },
                    products: {
                        select: {
                            title: true,
                            medias: true,
                            price: true,
                            description: true,
                            landing_image: true,
                            productCategories: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            },
            PlayerBidLogs: {
                orderBy: {
                    created_at: "desc",
                },
            },
            User: {
                select: {
                    avatar: true,
                    country: true,
                    status: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            },
        },
    });
    return queryResult;
};

/**
 * @description check if a player is registered in auction or not
 * @param registeration_id
 */
const checkPlayerRegisteration = async (registeration_id: string) => {
    const queryRx = await db.playerAuctionRegsiter.findFirst({
        where: {
            id: registeration_id,
        },
    });
    return queryRx;
};

/**
 * @description the create currency transaction using the CRYTPO
 * @param {IPurchase} data - data for creating the currency transaction
 * @returns
 */
const createPaymentTrx = async (data: IPurchase) => {
    const queryRx = await db.currencyTx.create({
        data: {
            credit_amount: data.amount,
            currency: Currency.CRYPTO,
            wallet_address: data.wallet_address,
            currency_type: currencyType.BIGTOKEN,
            crypto_transacation_hash: data.transaction_hash,
            created_by: data.player_id,
        },
    });
    return queryRx;
};

/**
 * Updates the auction status and buy-now expiration time for all players who lost the auction.
 * @async
 * @param {string} auction_id - The ID of the auction for which auction statuses are to be updated.
 * @returns {Promise<Object>} - A Promise that resolves to the updated database object containing the results of the update operation.
 */
const updateRegistrationAuctionStatus = async (auction_id: string) => {
    logger.log({
        level: "warn",
        message: "registeration auction status updated" + auction_id,
    });
    const lostexpirationTime: Date = new Date(new Date().getTime() + 1800000);
    const lostQueryResult = await db.playerAuctionRegsiter.updateMany({
        where: { AND: [{ auction_id, OR: [{ status: { not: "won" } }] }] },
        data: { status: "lost", buy_now_expiration: lostexpirationTime },
    });
    return lostQueryResult;
};

/**
 * Updates the payment status of a player's auction registration.
 * @param {string} id - The ID of the auction registration to update.
 * @returns {Promise<Object>} - A Promise that resolves to the updated database object.
 */
const updatetRegisterPaymentStatus = async (id: string) => {
    const queryResult = await db.playerAuctionRegsiter.update({
        where: { id: id },
        data: { payment_status: "success" },
    });
    return queryResult;
};

/**
 * Retrieves information about the winner of a specific auction.
 * @async
 * @param {string} auction_id - The ID of the auction for which winner information is to be retrieved.
 * @returns {Promise<Object|null>} - A Promise that resolves to an object containing winner information, or null if no winner is found.
 */
const getAuctionWinnerInfo = async (auction_id: string) => {
    const queryResult = await db.playerAuctionRegsiter.findFirst({
        where: { auction_id, status: "won" },
        select: {
            id: true,
            player_id: true,
            status: true,
            buy_now_expiration: true,
            PlayerBidLogs: {
                orderBy: {
                    created_at: "desc",
                },
            },
            User: {
                select: {
                    avatar: true,
                    country: true,
                    status: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });
    return queryResult;
};

/**
 * @description get the auction listing
 * @param {number} page
 * @param {number} limit
 */
const getAuctionLists = async (data: IAuctionListing) => {
    const filter: { id?: string; title?: { contains: string } } = {};
    if (data.auction_id) {
        filter.id = data.auction_id;
    }
    if (data.search) {
        filter.title = { contains: data.search };
    }
    const queryCount = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                {
                    state: data.state && data.state,
                },
            ],
        },
        select: {
            id: true,
        },
    });
    const queryResult = await db.auction.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                {
                    state: data.state && data.state,
                },
                filter,
            ],
        },
        include: {
            _count: {
                select: {
                    PlayerAuctionRegister: true,
                },
            },
            products: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    medias: true,
                    productMedias: {
                        select: {
                            medias: true,
                        },
                    },
                },
            },
            PlayerAuctionRegister: {
                where: {
                    player_id: data.player_id,
                },
                select: {
                    status: true,
                },
            },
            auctionCategory: true,
        },
        take: data.limit,
        skip: data.page * data.limit,
        orderBy: {
            created_at: "asc",
        },
    });
    return { queryResult, queryCount };
};

/**
 * @description Get the list of all auctions where product is used
 * @param {string} product_id id of product to find binding auctions
 * @returns {query} result of query execution
 */
const productAuctionList = async (product_id: string) => {
    const queryResult = await db.auction.findFirst({
        where: {
            product_id,
        },
    });
    return queryResult;
};

/**
 * @description Get the Player Auction Details By the Id
 * @param {string} id
 * @param {string} auction_id
 * @param {AUCTION_STATE} state
 * @returns
 */
const getPlayerAuctionDetailsById = async (
    id: string,
    auction_id: string,
    state: AUCTION_STATE
) => {
    const query = await db.auction.findFirst({
        where: {
            id: auction_id,
            is_deleted: false,
            status: true,
            state: state,
        },
        include: {
            _count: {
                select: {
                    PlayerAuctionRegister: true,
                },
            },
            products: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    medias: true,
                    productMedias: {
                        select: {
                            medias: true,
                        },
                    },
                },
            },
            PlayerAuctionRegister: {
                where: {
                    player_id: id,
                },
                select: {
                    status: true,
                },
            },
            auctionCategory: true,
        },
    });

    return query;
};

/**
 *
 * @param auction_id
 * @param player_id
 * @returns
 */

export const transferLastPlay = async (
    auction_id: string,
    player_id: string
) => {
    const query: Sql = Prisma.sql` SELECT
   (T1.total_bids * T2.plays_consumed_on_bid) as total_plays
 FROM (
   SELECT
        player_bid_log_T1.player_id,
        player_bid_log_T1.auction_id,
        player_bid_log_T1.total_bids,
        player_bid_log_T2.bid_price
    FROM (
        SELECT
            player_id,
            auction_id,
            COUNT(*) AS total_bids
    FROM
            player_bid_log
    where   player_bid_log.player_id=${player_id} 
    AND     player_bid_log.auction_id=${auction_id}
    GROUP BY
            player_id,auction_id ) as player_bid_log_T1
            LEFT JOIN player_bid_log as player_bid_log_T2
            ON player_bid_log_T1.player_id = player_bid_log_T2.player_id
            AND player_bid_log_T1.auction_id = player_bid_log_T2.auction_id
            ORDER BY player_bid_log_T2.created_at
    ) as T1
    RIGHT JOIN (
    SELECT
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
        INNER JOIN auctions as T3
    ON T3.id = T4.auction_id ) as T2
    ON T1.auction_id = T2.auction_id
    AND T1.player_id = T2.player_id
    where T2.auction_id = ${auction_id}`;

    const queryResult = await prisma.$queryRaw<{ total_plays: number }[]>(
        query
    );
    return queryResult;
};

const checkPlayerExistAuction = async (
    auction_id: string,
    player_id: string
) => {
    const queryResult = await db.playerAuctionRegsiter.findFirst({
        where: { auction_id, player_id },
        select: {
            id: true,
            player_id: true,
        },
    });
    return queryResult;
};

const minMaxPlayerRegisters = async (data: {
    auction_id: string;
    player_id: string;
}) => {
    const queryResult = await db.playerAuctionRegsiter.create({
        data: { ...data, status: "live" },
    });
    return queryResult;
};

//  Define the currency value
const currencyValue = 2;

/**
 * @description Get a list of total auction count.
 */
const getListTotalAuctionCount = async () => {
    const query: Sql = Prisma.sql`WITH AuctionData AS (
        SELECT
            A.id AS auction_id,
            A.title as auction_name,
            prod.title AS product_title,
            A.updated_at as updated_at,
            mas_auc.title AS auction_category_name,
            A.start_date as auction_start_date,
            COALESCE(A.registeration_count, 0) as registeration_count,
            COALESCE( A.plays_consumed_on_bid * 
                ( SELECT COUNT(*)
                    FROM player_bid_log
                    WHERE player_bid_log.auction_id = A.id
                ),0) AS total_plays_live_consumed_auction,
            COALESCE(
                CAST(
                    ROUND( (
                            SELECT
                                COUNT(*) * A.plays_consumed_on_bid AS plays_consumed
                            FROM player_bid_log AS P
                            WHERE
                                P.auction_id = A.id
                                AND P.player_id IN (
                                    SELECT player_id
                                    FROM player_auction_register AS pp
                                    WHERE
                                        pp.status = 'lost'
                                        AND pp.payment_status = 'success'
                                        AND pp.auction_id = A.id
                                )
                        )
                    ) AS INT
                ),
                0
            ) AS total_play_consumed_refund_after_buy_now,
            COALESCE( (
                    SELECT count(*)
                    FROM player_auction_register
                    where player_auction_register.auction_id = A.id
                ) * A.registeration_fees,
                0 ) as total_play_consumed_preregister
        FROM auctions AS A
            LEFT JOIN player_auction_register AS pp ON A.id = pp.auction_id
            LEFT JOIN player_bid_log AS P ON P.auction_id = A.id
            LEFT JOIN products AS prod ON A.product_id = prod.id
            LEFT JOIN master_auction_categories AS mas_auc ON A.auction_category_id = mas_auc.id
        where
            A.is_deleted = false AND A.status = true
        GROUP BY
            A.id,
            prod.title,
            mas_auc.title
    )
SELECT
    auction_id,
    auction_name,
    product_title,
    auction_category_name,
    auction_start_date,
    registeration_count,
    total_plays_live_consumed_auction,
    total_play_consumed_refund_after_buy_now,
    total_play_consumed_preregister,
    COALESCE( (
            total_plays_live_consumed_auction + total_play_consumed_preregister - 
            total_play_consumed_refund_after_buy_now),0) AS total_profit_plays,
    COALESCE( ( (
                total_plays_live_consumed_auction + total_play_consumed_preregister - 
                total_play_consumed_refund_after_buy_now ) * ${currencyValue}),0
) as total_profit_currency,
    CASE
        WHEN ${currencyValue} = 2 THEN 'INR'
        ELSE 'USD'
    END as currency_code,
    updated_at
FROM AuctionData`;
    const queryResult = await prisma.$queryRaw<ITotalAuctionInfo[]>(query);
    return queryResult;
};

/**
 * @description Get a list of total auction information with pagination.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of records to retrieve.
 */
const getListTotalAuction = async (offset: number, limit: number) => {
    const query: Sql = Prisma.sql`WITH AuctionData AS (
        SELECT
            A.id AS auction_id,
            A.title as auction_name,
            prod.title AS product_title,
            A.updated_at as updated_at,
            mas_auc.title AS auction_category_name,
            A.start_date as auction_start_date,
            COALESCE(A.registeration_count, 0) as registeration_count,
            COALESCE( A.plays_consumed_on_bid * 
                ( SELECT COUNT(*)
                    FROM player_bid_log
                    WHERE player_bid_log.auction_id = A.id
                ),0) AS total_plays_live_consumed_auction,
            COALESCE(
                CAST(
                    ROUND( (
                            SELECT
                                COUNT(*) * A.plays_consumed_on_bid AS plays_consumed
                            FROM player_bid_log AS P
                            WHERE
                                P.auction_id = A.id
                                AND P.player_id IN (
                                    SELECT player_id
                                    FROM player_auction_register AS pp
                                    WHERE
                                        pp.status = 'lost'
                                        AND pp.payment_status = 'success'
                                        AND pp.auction_id = A.id
                                )
                        )
                    ) AS INT
                ),
                0
            ) AS total_play_consumed_refund_after_buy_now,
            COALESCE( (
                    SELECT count(*)
                    FROM player_auction_register
                    where player_auction_register.auction_id = A.id
                ) * A.registeration_fees,
                0 ) as total_play_consumed_preregister
        FROM auctions AS A
            LEFT JOIN player_auction_register AS pp ON A.id = pp.auction_id
            LEFT JOIN player_bid_log AS P ON P.auction_id = A.id
            LEFT JOIN products AS prod ON A.product_id = prod.id
            LEFT JOIN master_auction_categories AS mas_auc ON A.auction_category_id = mas_auc.id
        where
            A.is_deleted = false AND A.status = true
        GROUP BY
            A.id,
            prod.title,
            mas_auc.title
    )
SELECT
    auction_id,
    auction_name,
    product_title,
    auction_category_name,
    auction_start_date,
    registeration_count,
    total_plays_live_consumed_auction,
    total_play_consumed_refund_after_buy_now,
    total_play_consumed_preregister,
    COALESCE( (
            total_plays_live_consumed_auction + total_play_consumed_preregister - 
            total_play_consumed_refund_after_buy_now),0) AS total_profit_plays,
    COALESCE( ( (
                total_plays_live_consumed_auction + total_play_consumed_preregister - 
                total_play_consumed_refund_after_buy_now ) * ${currencyValue}),0) as total_profit_currency,
    CASE
        WHEN ${currencyValue} = 2 THEN 'INR'
        ELSE 'USD'
    END as currency_code,
    updated_at
FROM AuctionData
LIMIT ${+limit}
OFFSET ${+limit * offset}`;
    const queryResult = await prisma.$queryRaw<ITotalAuctionInfo[]>(query);
    return queryResult;
};

/**
 *@description Get auction information by ID including auction details, product name, and profit calculations.
 * @param {string} auction_id - The ID of the auction to retrieve information for auction.
 */
export const getInformationAuctionById = async (auction_id: string) => {
    const query: Sql = Prisma.sql`WITH AuctionData AS (
        SELECT
            A.id AS auction_id,
            A.title as auction_name,
            A.updated_at as updated_at,
            prod.title AS product_title,
            mas_auc.title AS auction_category_name,
            A.start_date as auction_start_date,
            COALESCE(A.registeration_count, 0) as registeration_count,
            COALESCE( A.plays_consumed_on_bid * 
                ( SELECT COUNT(*)
                    FROM player_bid_log
                    WHERE player_bid_log.auction_id = A.id
                ),0) AS total_plays_live_consumed_auction,
            COALESCE(
                CAST(
                    ROUND( (
                            SELECT
                                COUNT(*) * A.plays_consumed_on_bid AS plays_consumed
                            FROM player_bid_log AS P
                            WHERE
                                P.auction_id = A.id
                                AND P.player_id IN (
                                    SELECT player_id
                                    FROM player_auction_register AS pp
                                    WHERE
                                        pp.status = 'lost'
                                        AND pp.payment_status = 'success'
                                        AND pp.auction_id = A.id
                                )
                        )
                    ) AS INT
                ),
                0
            ) AS total_play_consumed_refund_after_buy_now,
            COALESCE( (
                    SELECT count(*)
                    FROM player_auction_register
                    where player_auction_register.auction_id = A.id
                ) * A.registeration_fees,
                0 ) as total_play_consumed_preregister
        FROM auctions AS A
            LEFT JOIN player_auction_register AS pp ON A.id = pp.auction_id
            LEFT JOIN player_bid_log AS P ON P.auction_id = A.id
            LEFT JOIN products AS prod ON A.product_id = prod.id
            LEFT JOIN master_auction_categories AS mas_auc ON A.auction_category_id = mas_auc.id
        where
            A.is_deleted = false AND A.status = true
        GROUP BY
            A.id,
            prod.title,
            mas_auc.title
    )
SELECT
    auction_id,
    auction_name,
    product_title,
    auction_category_name,
    auction_start_date,
    registeration_count,
    total_plays_live_consumed_auction,
    total_play_consumed_refund_after_buy_now,
    total_play_consumed_preregister,
    COALESCE( (
            total_plays_live_consumed_auction + total_play_consumed_preregister - 
            total_play_consumed_refund_after_buy_now),0) AS total_profit_plays,
    COALESCE( ( (
                total_plays_live_consumed_auction + total_play_consumed_preregister - 
                total_play_consumed_refund_after_buy_now ) * ${currencyValue}),0) as total_profit_currency,
    CASE
        WHEN ${currencyValue} = 2 THEN 'INR'
        ELSE 'USD'
    END as currency_code,
    updated_at
FROM AuctionData
WHERE
    auction_id = ${auction_id}`;

    const queryResult = await prisma.$queryRaw<IAuctionTotal[]>(query);
    return queryResult;
};

/**
 * @description Get the total auction statistics including plays consumed,
 * registration fees,and profit calculations.
 */
const getTotalAuction = async () => {
    const query: Sql = Prisma.sql`WITH AuctionData AS (
        SELECT
            A.id AS auction_id,
            A.title,
            prod.title AS product_title,
            mas_auc.title AS auction_category_name,
            COALESCE(
                A.plays_consumed_on_bid * 
                ( SELECT COUNT(*)
                    FROM player_bid_log
                    WHERE player_bid_log.auction_id = A.id
                ),0 ) AS total_plays_live_consumed_auction,
            COALESCE(
                CAST(
                    ROUND( (
                            SELECT COUNT(*) * A.plays_consumed_on_bid AS plays_consumed
                            FROM player_bid_log AS P
                            WHERE
                                P.auction_id = A.id
                                AND P.player_id IN (
                                    SELECT player_id
                                    FROM player_auction_register AS pp
                                    WHERE
                                        pp.status = 'lost'
                                        AND pp.payment_status = 'success'
                                        AND pp.auction_id = A.id
                                )
                        )
                    ) AS INT
                ),
                0
            ) AS total_play_consumed_refund_after_buy_now,
            COALESCE( (
                    SELECT count(*)
                    FROM player_auction_register
                    where player_auction_register.auction_id = A.id
                ) * A.registeration_fees,0) as total_play_consumed_preregister
        FROM auctions AS A
            LEFT JOIN player_auction_register AS pp ON A.id = pp.auction_id
            LEFT JOIN player_bid_log AS P ON P.auction_id = A.id
            LEFT JOIN products AS prod ON A.product_id = prod.id
            LEFT JOIN master_auction_categories AS mas_auc ON A.auction_category_id = mas_auc.id
        where
            A.is_deleted = false AND A.status = true
        GROUP BY
            A.id,
            prod.title,
            mas_auc.title
    )
SELECT
    SUM( total_plays_live_consumed_auction ) AS total_sum_plays_live_consumed_auction,
    SUM( total_play_consumed_refund_after_buy_now ) AS total_sum_play_consumed_refund_after_buy_now,
    SUM( total_play_consumed_preregister ) AS total_sum_play_consumed_preregister,
    SUM( (total_plays_live_consumed_auction + total_play_consumed_preregister - 
        total_play_consumed_refund_after_buy_now)) AS total_profit_plays, 
    (SUM( 
        (total_plays_live_consumed_auction + total_play_consumed_preregister - 
        total_play_consumed_refund_after_buy_now)) * ${currencyValue}
    ) AS total_profit_currency,
    CASE
        WHEN ${currencyValue}= 2 THEN 'INR'
        ELSE 'USD'
    END as currency_code
FROM AuctionData`;
    const queryResult = await prisma.$queryRaw<IAuctionTotalCount[]>(query);
    return queryResult;
};

/**
 * Retrieves all live auctions for a specific player.
 * @param {string} player_id - The ID of the player for whom live auctions are requested.
 * @returns {Promise<Array>} A promise that resolves to an array of live auction objects.
 * @throws {Error} Throws an error if there is an issue with fetching the live auction data.
 */

const getAllLiveAuction = async (player_id: string) => {
    const queryResult = await db.auction.findMany({
        where: {
            is_deleted: false,
            state: "live",
        },
        include: {
            _count: {
                select: {
                    PlayerAuctionRegister: true,
                },
            },
            PlayerAuctionRegister: {
                where: {
                    player_id: player_id,
                },
                select: {
                    status: true,
                },
            },
            auctionCategory: {
                select: {
                    code: true,
                    title: true,
                },
            },
        },
    });
    return queryResult;
};

export const auctionQueries = {
    create,
    getAll,
    getAllAuctions,
    productAuctionList,
    getActiveAuctioById,
    getAuctionById,
    update,
    remove,
    getMultipleActiveById,
    fetchAuctionLogs,
    upcomingPlayerAuction,
    updateAuctionState,
    totalCountRegisterAuctionByAuctionId,
    getUpcomingAuctionById,
    playerAuctionRegistered,
    playerOpenAuctionRegister,
    checkIfPlayerExists,
    playerRegistrationAuction,
    auctionRegistrationCount,
    startAuction,
    fetchPlayerAuction,
    updatePlayerRegistrationAuctionStatus,
    updatePlayerRegistrationAuctionResultStatus,
    getplayerRegistrationAuctionDetails,
    checkPlayerRegisteration,
    createPaymentTrx,
    updateRegistrationAuctionStatus,
    getAuctionWinnerInfo,
    updatetRegisterPaymentStatus,
    getAuctionLists,
    getPlayerAuctionDetailsById,
    transferLastPlay,
    checkPlayerExistAuction,
    minMaxPlayerRegisters,
    getListTotalAuction,
    getInformationAuctionById,
    getListTotalAuctionCount,
    getTotalAuction,
    findPlayersRegistered,
    getAllLiveAuction,
};
