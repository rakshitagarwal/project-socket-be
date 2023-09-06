import { db } from "../../config/db";
import {
    IAuctionCategory,
    IDeleteIds,
    IPutAuctionCategory,
} from "./typings/auction-category-types";

/**
 * @param {IAuctionCategory} data  - auction category data
 * @description - data for the auction category
 */
const create = async (data: IAuctionCategory) => {
    const query = await db.masterAuctionCategory.create({
        data,
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * @param {string} id - auction category Id
 * @description - check if active auction is exists or not
 * @returns auction which matched Id
 */
const IsExistsActive = async (id: string) => {
    const query = await db.masterAuctionCategory.findFirst({
        where: {
            AND: {
                id,
                is_deleted: false,
            },
        },
        select: {
            id: true,
            title: true,
            status: true,
            is_deleted: true,
        },
    });
    return query;
};

/**
 * @param {string} id - auction category Id
 * @param {IPutAuctionCategory} data
 * @returns updated the auction details
 */
const update = async (id: string, data: IPutAuctionCategory) => {
    const query = await db.masterAuctionCategory.update({
        where: { id },
        data,
    });
    return query;
};

/**
 * @description - get {id, title} of the auction category
 * @returns - sending the base details of the auction category
 */
const getAll = async (search: string) => {
    const query = await db.masterAuctionCategory.findMany({
        where: {
            title: {
                mode: "insensitive",
                contains: search ? search : "",
            },
            is_deleted: false,
        },
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            title: "desc",
        },
    });
    return query;
};

/**
 * Remove all data from the auction category
 * @param {IDeleteIds} data - multiple ids of the auction category
 * @returns - count of deleted records
 */
const removeAll = async (data: IDeleteIds) => {
    const query = await db.masterAuctionCategory.updateMany({
        where: {
            AND: {
                id: {
                    in: data.ids,
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
 * verify if multiple Id exists or not
 * @param {IDeleteIds} data - of array which contain string
 * @returns queries for the sending the multiple data in masterAuctionCategory
 */
const isIdExists = async (data: IDeleteIds) => {
    const query = await db.masterAuctionCategory.findMany({
        where: {
            AND: {
                id: {
                    in: data.ids,
                },
                is_deleted: false,
            },
        },
        orderBy: {
            updated_at: "desc"
        }
    });
    return query;
};

/**
 * @param {string} title  - it is exist or not for title in product category data
 * @description - get for title in the product category
 */
const getTitle = async (title: string) => {
    const queryResult = await db.masterAuctionCategory.findFirst({
        where: {
            title: title, is_deleted: false
        },
        select: {
            id: true,
            status: false,
            updated_at: false,
        },
    });
    return queryResult;
};

export const auctionCategoryQueries = {
    create,
    IsExistsActive,
    update,
    getAll,
    removeAll,
    isIdExists,
    getTitle
};
