import { Sql } from "@prisma/client/runtime";
import { db } from "../../config/db";
import {
    IuserQuery,
    IupdateUser,
    IuserPaginationQuery,
    IWalletTx,
    IDeductPlx,
    IPlayerBidLog,
    // IPlayerActionWinner,
    PlayerBidLogGroup,
    Ispend_on,
    IMultipleUsers,
    ILastPlayTrx,
    IminAuctionBidLog,
    IGetAllUsers,
    ITransfer,
} from "./typings/user-types";
import { PlaySpend, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @description - this query is fetch specific user information
 * @param query - query contains id or email information
 * @returns
 */
const fetchUser = async (query: IuserQuery) => {
    const user = await db.user.findFirst({
        where: { ...query, is_deleted: false },
        select: {
            email: true,
            password: true,
            first_name: true,
            last_name: true,
            country: true,
            mobile_no: true,
            avatar: true,
            referral_code: true,
            is_verified: true,
            status: true,
            id: true,
            roles: {
                select: {
                    title: true,
                },
            },
        },
    });
    return user;
};

/**
 * @description this function is used to update user information
 * @param query - contains unique user information
 * @param payload - update user information
 * @returns
 */
const updateUser = async (query: IuserQuery, payload: IupdateUser) => {
    const user = await db.user.update({
        where: { ...query },
        data: payload,
    });
    return user;
};

/**
 * @description - fetch all users information
 * @param query - this query contains search user information and limit of the user
 * @returns
 */
const fetchAllUsers = async (query: IuserPaginationQuery) => {
    const user: Sql = Prisma.sql`
    SELECT
        u.status,
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.country,
        u.avatar,
        u.mobile_no,
        COALESCE(T3.Player_in_Wallet, 0) AS Plays_In_Wallet,
        COALESCE(T1.Auction_Won, 0) AS Auction_Won,
        COALESCE(T2.Player_Participated, 0) AS Player_Participated
    FROM
        users AS u
    LEFT JOIN (
        SELECT
            par.player_id,
            COUNT(*) AS Auction_Won
        FROM
            player_auction_register par
        WHERE
            par.status = 'won'
        GROUP BY
            par.player_id
        ) AS T1
    ON
    u.id = T1.player_id
    LEFT JOIN (
        SELECT
            par.player_id,
            COUNT(*) AS Player_Participated
        FROM
            player_auction_register par
        GROUP BY
            par.player_id
        ) AS T2
    ON
        u.id = T2.player_id
    LEFT JOIN (
        SELECT
            pwt.created_by,
            (COALESCE(SUM(pwt.play_credit), 0) - COALESCE(SUM(pwt.play_debit), 0)) as Player_in_Wallet
        FROM
            player_wallet_transaction pwt
        GROUP BY
            pwt.created_by
        ) AS T3
    ON
        u.id = T3.created_by
    INNER JOIN
        master_roles AS mr
    ON
        u.role_id=mr.id
    WHERE
        mr.title='Player' 
        AND u.is_deleted=FALSE
        AND u.is_verified=TRUE 
        ${
            query?.search
                ? Prisma.raw(
                      `AND (u.first_name ILIKE '%${query.search}%' OR u.last_name ILIKE '%${query.search}%' OR u.email ILIKE '%${query.search}%')`
                  )
                : Prisma.raw("")
        }
    ORDER BY ${Prisma.raw(query?._sort as string)} ${Prisma.raw(
        query?._order as string
    )}
    OFFSET ${Prisma.raw((query.page * query.limit) as unknown as string)}
    LIMIT ${Prisma.raw(query.limit as unknown as string)}
    `;

    const userDetails = await prisma.$queryRaw<IGetAllUsers[]>(user);

    const count = await db.user.count({
        where: {
            AND: [
                {
                    is_deleted: false,
                    is_verified: true,
                    // status: true,
                },
                {
                    roles: {
                        title: "Player",
                    },
                },
                {
                    OR: query.filter,
                },
            ],
        },
    });
    return { userDetails, count };
};

/**
 * @description Get all auctions registration data for a player
 * @param {string} id player id
 * @returns {user[]}
 */
const fetchUserAuctions = async (id: string) => {
    const query = await db.playerAuctionRegsiter.findMany({
        where: { player_id: id ,status:"live"},
        select:{
            player_id:true,
            auction_id:true,
        }
    });
    return query;
};

/**
 * @description Get one player
 * @param {string} id
 * @returns {user}
 */
const fetchPlayerId = async (id: string) => {
    const query = await db.user.findFirst({
        where: {
            AND: [
                {
                    id,
                    status: true,
                    is_deleted: false,
                },
            ],
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            roles: {
                select: {
                    title: true,
                },
            },
        },
    });
    return query;
};

/**
 * @description ADD plays in the wallet
 * @param {IWalletTx} data
 * @returns
 */
const addPlayBalanceTx = async (
    prisma: PrismaClient,
    data: IWalletTx & { currency_transaction_id: string }
) => {
    const query = await prisma.playerWalletTransaction.create({
        data: {
            play_credit: data.plays,
            created_by: data.player_id,
            spend_on: "BUY_PLAYS",
            currency_transaction_id: data.currency_transaction_id,
        },
        select: {
            id: true,
            play_credit: true,
            play_debit: true,
        },
    });
    return query;
};

/**
 * @description Add extra plays for using bigtoken in the wallet
 * @param {PrismaClient} prisma
 * @param {IWalletTx} data
 * @returns
 */
const addExtraPlays = async (prisma: PrismaClient, data: IWalletTx) => {
    const query = await prisma.playerWalletTransaction.create({
        data: {
            play_credit: data.plays,
            spend_on: PlaySpend.EXTRA_BIGPLAYS,
            created_by: data.player_id,
        },
    });
    return query;
};

const addPlayRefundBalanceTx = async (
    data: {
        created_by: string;
        spend_on: Ispend_on;
        play_credit: number;
        auction_id: string;
    }[]
) => {
    const query = await db.playerWalletTx.createMany({ data });
    return query;
};

/**
 * @description created the transaction for the BUY plays debited
 * @param {string} id
 * @param {number} plays
 */
const createTrx = async (
    prisma: PrismaClient,
    player_id: string,
    plays: number
) => {
    const query = await prisma.playerWalletTransaction.create({
        data: {
            play_debit: plays,
            created_by: player_id,
            spend_on: "AUCTION_REGISTER_PLAYS",
        },
    });
    return query;
};

/**
 * GET player tranasction using the transaction_id
 * @param {string} trx_id
 */

const getPlayerTrxById = async (player_id: string, trx_id: string) => {
    const query = await db.playerWalletTx.findFirst({
        where: {
            id: trx_id,
            created_by: player_id,
        },
    });
    return query;
};

/**
 * @description the data for creating the bid transaction
 * @param {IDeductPlx} data
 * @returns
 */
const createBidtransaction = async (
    data: IDeductPlx & { auction_id: string }
) => {
    const query = await db.playerWalletTx.create({
        data: {
            play_debit: data.plays,
            created_by: data.player_id,
            auction_id: data.auction_id,
            spend_on: "BID_PLAYS",
        },
    });
    return query;
};

/**
 * Records player bid logs in the database.
 * @async
 * @param {IPlayerBidLog[]} data - An array of data representing the player bid logs to be recorded.
 * @returns {Promise<PlayerBidLog[]>} A promise that resolves to an array of Player
 */
const playerBidLog = async (data: [IPlayerBidLog]) => {
    const queryResult = await db.playerBidLogs.createMany({
        data: data,
    });
    return queryResult;
};

const minPlayerBidLogs = async (data: [IminAuctionBidLog]) => {
    const queryResult = await db.playerBidLogs.createMany({
        data: data,
    });
    return queryResult;
};

/**
 * fetch the total number of bids made by a specific player in a given auction.
 * @async
 * @param {string} auctionId - The ID of the auction to retrieve bid information from.
 * @param {string} playerId - The ID of the player to get the total bids for.
 * @returns {Promise<number>} A promise that resolves to the total number of bids made by the specified player in the given auction.
 */
const getWinnerTotalBid = async (auctionId: string, playerId: string) => {
    const queryResult = await db.playerBidLogs.count({
        where: { auction_id: auctionId, player_id: playerId },
    });
    return queryResult;
};

/**
 * Fetches the highest bidders for a specific auction.
 * @async
 * @param {string} auctionId - The ID of the auction to retrieve highest bidders for.
 * @returns {Promise<PlayerBidLogGroup[]>} A promise that resolves to an array of PlayerBidLogGroup objects representing the highest bidders.
 */
const fetchAuctionHigherBider = async (
    auctionId: string
): Promise<PlayerBidLogGroup[]> => {
    const query: Sql = Prisma.sql`
        SELECT player_id, player_name, auction_id, profile_image, COUNT(*) AS count
        FROM player_bid_log
        WHERE auction_id = ${auctionId}
        GROUP BY player_id, player_name, auction_id, profile_image ORDER BY count DESC LIMIT 3;`;
    const queryResult = await prisma.$queryRaw<PlayerBidLogGroup[]>(query);
    return queryResult;
};

const createPaymentTrx = async (prisma: PrismaClient, data: IWalletTx) => {
    const queries = await prisma.currencyTransaction.create({
        data: {
            credit_amount: data.amount,
            currency: data.currency,
            currency_type: data.currencyType,
            wallet_address: data.wallet_address,
            crypto_transacation_hash: data.transaction_hash,
            created_by: data.player_id,
        },
    });
    return queries;
};

/**
 * @description transferPlays is used to credit and debit plays for transfer
 * @param {ITransfer} data - it contains the player id, id of other player and number of plays
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns { creditTrx, debitTrx } - the result of execution of credit and debit plays query.
 */
const transferPlays = async (prisma: PrismaClient, data: ITransfer) => {
    const creditTrx = await prisma.playerWalletTransaction.create({
        data: {
            play_credit: data.plays,
            spend_on: "RECEIVED_PLAYS",
            created_by: data.transfer as string,
            transferred_from: data.id,
        },
    });

    const debitTrx = await prisma.playerWalletTransaction.create({
        data: {
            play_debit: data.plays,
            spend_on: "TRANSFER_PLAYS",
            created_by: data.id,
            transferred_to: data.transfer,
        },
    });
    return { creditTrx, debitTrx };
};

const playerPlaysBalance = async (
    player_id: string
): Promise<PlayerBidLogGroup[]> => {
    const query: Sql = Prisma.sql`SELECT 
                (COALESCE(SUM(play_credit), 0) - COALESCE(SUM(play_debit), 0)) as play_balance,
                    player_wallet_transaction.created_by as player_id
                FROM 
                    player_wallet_transaction
                WHERE 
                    created_by = ${player_id}
                GROUP BY 
                     player_wallet_transaction.created_by;
  `;
    const queryResult = await prisma.$queryRaw<PlayerBidLogGroup[]>(query);
    return queryResult;
};

/**
 * @description userPlaysBalance is used to give play_balance of one user/player
 * @param {string} player_id - it contains the player id to find user in transactions
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns {queryResult} - the result of execution of query.
 */
const userPlaysBalance = async (
    player_id: string,
    prisma: PrismaClient
): Promise<PlayerBidLogGroup[]> => {
    const query: Sql = Prisma.sql`SELECT 
                (COALESCE(SUM(play_credit), 0) - COALESCE(SUM(play_debit), 0)) as play_balance,
                    player_wallet_transaction.created_by as player_id
                FROM 
                    player_wallet_transaction
                WHERE 
                    created_by = ${player_id}
                GROUP BY 
                     player_wallet_transaction.created_by;
  `;
    const queryResult = await prisma.$queryRaw<PlayerBidLogGroup[]>(query);
    return queryResult;
};

/**
 * @description creditTransactions is used to give credit_sum of one user/player
 * @param {string} player_id - it contains the player id to find user in transactions
 * @param {PrismaClient} prisma - prisma client for transaction functioning
 * @returns {queryResult} - the result of execution of query.
 */
const creditTransactions = async (
    player_id: string,
    prisma: PrismaClient
): Promise<PlayerBidLogGroup[]> => {
    const query: Sql = Prisma.sql`SELECT  (COALESCE(SUM(play_credit), 0)) as credit_sum,
                                        player_wallet_transaction.created_by as player_id
                                FROM 
                                    player_wallet_transaction
                                WHERE 
                                    created_by = ${player_id}
                                    AND spend_on = 'BUY_PLAYS'
                                    AND play_credit IS NOT NULL
                                GROUP BY 
                                    player_wallet_transaction.created_by;`;
    const queryResult = await prisma.$queryRaw<PlayerBidLogGroup[]>(query);
    return queryResult;
};

/**
 * @description Get the player Role Id from the users
 * @returns id of players
 */
const getPlayerRoleId = async () => {
    const query = await db.masterRole.findFirst({
        where: {
            title: "Player",
        },
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * @param {IMultipleUsers[]} users - creating the nultuple users for Bots
 * @description creating the multiple users
 */
const createMultipleUsers = async (users: IMultipleUsers[]) => {
    const query = await db.user.createMany({
        data: users,
    });
    return query;
};

const addMultiplePlayBlx = async (data: string[], plays: number) => {
    const BUY_PLAYS: PlaySpend = "BUY_PLAYS";
    const query = await db.user.findMany({
        where: {
            email: {
                in: data,
            },
        },
        select: {
            id: true,
        },
    });
    const details = query.map((qx) => {
        return {
            play_credit: plays,
            created_by: qx.id,
            spend_on: BUY_PLAYS,
        };
    });
    const queries = await db.playerWalletTx.createMany({
        data: details,
    });
    return { queries, details };
};

/**
 * @description Get Random Bots for simulations
 */
const getRandomBot = async () => {
    const query = await db.user.findMany({
        where: {
            is_bot: true,
            status: true,
            is_deleted: false,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            avatar: true,
            country: true,
            is_bot: true,
        },
    });
    return query;
};

//referral code for player
const getPlayerByReferral = async (player_referral_code: string) => {
    const query = await db.user.findFirst({
        where: {
            referral_code: player_referral_code,
        },
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * PLays refund after the auction END
 * @param data - player details
 * @returns
 */
const addLastPlaysTrx = async (data: ILastPlayTrx) => {
    const queries = await db.playerWalletTx.create({
        data: {
            play_credit: data.plays,
            spend_on: data.spends_on,
            auction_id: data.auction_id,
            created_by: data.player_id,
        },
    });
    return queries;
};

/**
 * @description Fetch the admin information for email
 */
const fetchAdminInfo = async () => {
    const user = await db.user.findFirst({
        where: {
            roles: {
                title: "Admin",
                is_deleted: false,
                status: true,
            },
        },
        select: {
            first_name: true,
            email: true,
        },
    });
    return user;
};

/**
 * Fetches player transactions based on the provided query parameters.
 * @param {Object} queryData - The query parameters for filtering player transactions.
 * @param {string} queryData.player_id - The unique identifier for the player.
 * @param {number} queryData.limit - The maximum number of transactions to retrieve.
 * @param {number} queryData.offset - The offset for pagination, indicating the starting position of transactions.
 * @returns
 */
const fetchPlayerTransactions = async (queryData: {
    player_id: string;
    limit: number;
    offset: number;
    spend_on: PlaySpend | undefined;
}) => {
    const query: Sql = Prisma.sql`
    SELECT 
    T1.auction_id, 
    T1.spend_on,
    T1.created_by,
    T1.play_credit,
    sum(T1.play_debit) as play_debit,
    T1.transferred_from,
    T1.transferred_to,
    T1.plays_refund_id,
    T1.currency_transaction_id,
    auctions.title as auction_name,
    users.first_name as user_name,
    T2.first_name as to_user,
    T3.first_name as from_user,
    MAX(T1.created_at) as created_at
FROM 
    player_wallet_transaction as T1
LEFT JOIN 
    auctions ON T1.auction_id = auctions.id
LEFT JOIN 
    users ON T1.created_by = users.id
LEFT JOIN 
    users AS T2 ON T1.transferred_to = T2.id
LEFT JOIN 
    users AS T3 ON T1.transferred_from = T3.id
WHERE 
    T1.created_by = ${queryData.player_id}  
    ${
        queryData?.spend_on
            ? Prisma.raw(`AND (T1.spend_on = '${queryData.spend_on}')`)
            : Prisma.raw("")
    }
GROUP BY 
    T1.play_debit,
    T1.auction_id, 
    T1.spend_on, 
    T1.created_by, 
    T1.play_credit, 
    T1.transferred_from, 
    T1.transferred_to, 
    T1.plays_refund_id, 
    T1.currency_transaction_id, 
    auctions.title,
    users.first_name,
    T2.first_name,
    T3.first_name,
    DATE(T1.created_at)
    ORDER BY created_at DESC
LIMIT ${queryData.limit}
OFFSET ${queryData.offset * queryData.limit}
`;

    const countQuery = Prisma.sql`
    SELECT 
    T1.auction_id, 
    T1.spend_on,
    T1.created_by,
    T1.play_credit,
	sum(T1.play_debit) as play_debit,
    T1.transferred_from,
    T1.transferred_to,
    T1.plays_refund_id,
    T1.currency_transaction_id,
    auctions.title as auction_name,
    users.first_name as user_name,
    T2.first_name as to_user,
    T3.first_name as from_user,
    MAX(T1.created_at) as created_at
FROM 
    player_wallet_transaction as T1
LEFT JOIN 
    auctions ON T1.auction_id = auctions.id
LEFT JOIN 
    users ON T1.created_by = users.id
LEFT JOIN 
    users AS T2 ON T1.transferred_to = T2.id
LEFT JOIN 
    users AS T3 ON T1.transferred_from = T3.id
WHERE 
    T1.created_by = ${queryData.player_id}  
    ${
        queryData?.spend_on
            ? Prisma.raw(`AND (T1.spend_on = '${queryData.spend_on}')`)
            : Prisma.raw("")
    }
GROUP BY 
    T1.play_debit,
    T1.auction_id, 
    T1.spend_on, 
    T1.created_by, 
    T1.play_credit, 
    T1.transferred_from, 
    T1.transferred_to, 
    T1.plays_refund_id, 
    T1.currency_transaction_id, 
    auctions.title,
    users.first_name,
    T2.first_name,
    T3.first_name,
    DATE(T1.created_at)
    ORDER BY created_at DESC`;
    const queryResult = await prisma.$queryRaw<PlayerBidLogGroup[]>(query);
    const totalRecord = await prisma.$queryRaw<{ count: string }[]>(countQuery);
    return { queryResult, totalRecord: totalRecord.length };
};

/**
 * @description - Update the player wallet auction id when player join 
 * @param auction_id - 
 * @param wallettranxId -
 * @returns 
 */
const playerWalletTxcn = async (auction_id: string, wallettranxId: string) => {
    const queryResult = await db.playerWalletTx.update({
        data: { auction_id },
        where: { id: wallettranxId },
    });
    return queryResult;
};

const userQueries = {
    fetchUser,
    updateUser,
    fetchAllUsers,
    fetchUserAuctions,
    fetchPlayerId,
    addPlayBalanceTx,
    getPlayerTrxById,
    createBidtransaction,
    playerBidLog,
    getWinnerTotalBid,
    fetchAuctionHigherBider,
    addPlayRefundBalanceTx,
    createTrx,
    createPaymentTrx,
    transferPlays,
    playerPlaysBalance,
    getPlayerRoleId,
    createMultipleUsers,
    addMultiplePlayBlx,
    minPlayerBidLogs,
    getRandomBot,
    getPlayerByReferral,
    creditTransactions,
    userPlaysBalance,
    addLastPlaysTrx,
    fetchAdminInfo,
    addExtraPlays,
    fetchPlayerTransactions,
    playerWalletTxcn
};
export default userQueries;
