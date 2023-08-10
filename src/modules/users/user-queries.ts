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
    const user = await db.user.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter },
                {
                    roles: {
                        title: "Player",
                    },
                },
            ],
        },
        take: query.limit,
        skip: query.page * query.limit,
        select: {
            email: true,
            id: true,
            last_name: true,
            first_name: true,
            country: true,
            avatar: true,
            mobile_no: true,
            roles: {
                select: {
                    title: true,
                },
            },
        },
    });
    const count = await db.user.count({
        where: {
            is_deleted: false,
            roles: {
                title: "Player",
            },
        },
    });
    return { user, count };
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
            spend_on: "BUY_PLAYS",
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

const createPaymentTrx = async (data: IWalletTx) => {
    const queries = await db.currencyTx.create({
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

const playerPlaysBalance = async (
    auctionId: string
): Promise<PlayerBidLogGroup[]> => {
    const query: Sql = Prisma.sql`SELECT 
                (COALESCE(SUM(play_credit), 0) - COALESCE(SUM(play_debit), 0)) as play_balance,
                    player_wallet_transaction.created_by as player_id
                FROM 
                    player_wallet_transaction
                WHERE 
                    created_by = ${auctionId}
                GROUP BY 
                     player_wallet_transaction.created_by;
  `;
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
        orderBy:{
            updated_at:"desc"
        },
        take:10
    });
    return query;
};

const userQueries = {
    fetchUser,
    updateUser,
    fetchAllUsers,
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
    playerPlaysBalance,
    getPlayerRoleId,
    createMultipleUsers,
    addMultiplePlayBlx,
    getRandomBot,
};
export default userQueries;
