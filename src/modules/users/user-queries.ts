import { db } from "../../config/db";
import {
    IuserQuery,
    IupdateUser,
    IuserPaginationQuery,
    IWalletTx,
    IDeductPlx,
} from "./typings/user-types";

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

const addPlayBalanceTx = async (data: IWalletTx) => {
    const query = await db.playerWalletTx.create({
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

const playerWalletBac = async (player_id: string) => {
    const query = await db.playerWalletTx.findMany({
        where: {
            created_by: player_id,
        },
        select: {
            play_credit: true,
            play_debit: true,
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

const debitPlayBalance = async (data: IDeductPlx) => {
    const query = await db.playerWalletTx.create({
        data: {
            play_debit: data.plays,
            created_by: data.player_id,
            spend_on: "BUY_PLAYS",
        },
    });
    return query;
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
};
export default userQueries;
