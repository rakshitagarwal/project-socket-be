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
} from "./typings/user-types";
import { Prisma, PrismaClient } from "@prisma/client";

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
    const user = await db.user.update({ where: { ...query }, data: payload });
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

const addPlayBalanceTx = async (prisma: PrismaClient, data: IWalletTx) => {
    const query = await prisma.playerWalletTransaction.create({
        data: {
            play_credit: data.plays,
            created_by: data.player_id,
            spend_on: "BUY_PLAYS",
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
    data: { created_by: string; spend_on: Ispend_on; play_credit: number,auction_id:string }[]
) => {
    const query = await db.playerWalletTx.createMany({ data });
    return query;
};

const addPlaysToWallet = async (prisma: PrismaClient, data: IWalletTx) => {
    const query = await prisma.playerWallet.create({
        data: {
            play_balance: data.plays,
            player_id: data.player_id,
        },
    });
    return query;
};

const updatePlayerWallet = async (prisma: PrismaClient, data: IWalletTx) => {
    const query = await prisma.playerWallet.updateMany({where:{player_id:data.player_id},data:{play_balance:data.plays}});
    return query;
};


const playerWalletBac = async (player_id: string) => {
    const query = await db.playerWallet.findFirst({
        where: {
            player_id: player_id,
        },
        select: {
            id: true,
            play_balance: true,
        },
    });
    return query;
};

/**
 * @description created the transaction for the BUY plays debited
 * @param {string} id
 * @param {number} plays
 */
const createTrx = async (
    prisma: PrismaClient,
    id: string,
    player_id: string,
    plays: number
) => {
    const query = await prisma.playerWalletTransaction.create({
        data: {
            play_debit: plays,
            created_by: player_id,
            spend_on: "BUY_PLAYS",
            wallet_id: id,
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
 * @description the debited amount from the player wallet balance
 * @param {PrismaClient} prisma
 * @param {IDeductPlx} data
 * @returns
 */

const debitPlayBalance = async (
    prisma: PrismaClient,
    data: IDeductPlx & {
        walletId: string;
    }
) => {
    const query = await prisma.playerWallet.update({
        where: {
            id: data.walletId,
        },
        data: {
            play_balance: data.plays,
        },
    });        
    return query;
};

/**
 * @description the data for creating the bid transaction
 * @param {IDeductPlx} data
 * @returns
 */
const createBidtransaction = async (data: IDeductPlx) => {
    const query = await db.playerWalletTx.create({
        data: {
            play_debit: data.plays,
            created_by: data.player_id,
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
 * Records the winner of a player auction in the database.
 * @param {IPlayerActionWinner} data - The data representing the player auction winner to be recorded.
 * @returns {Promise<AuctionWinner>} A promise that resolves to the created AuctionWinner object representing the recorded player auction winner.
 */

// const playerAuctionWinner = async (data: IPlayerActionWinner) => {
//     const queryResult = await db.auctionResult.create({
//         data: { ...data },
//     });
//     return queryResult;
// };

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

const userQueries = {
    fetchUser,
    updateUser,
    fetchAllUsers,
    fetchPlayerId,
    addPlayBalanceTx,
    playerWalletBac,
    getPlayerTrxById,
    debitPlayBalance,
    createBidtransaction,
    playerBidLog,
    // playerAuctionWinner,
    getWinnerTotalBid,
    fetchAuctionHigherBider,
    addPlayRefundBalanceTx,
    createTrx,
    addPlaysToWallet,
    updatePlayerWallet
};
export default userQueries;
