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
            id,
            is_deleted: false,
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
const getAll = async () => {
    const query = await db.masterAuctionCategory.findMany({
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

const removeAll = async (data: IDeleteIds) => {
    const query = await db.masterAuctionCategory.deleteMany({
        where: {
            id: {
                in: data.ids,
            },
        },
    });
    return query;
};

const isIdExists = async (data: IDeleteIds) => {
    const query = await db.masterAuctionCategory.findMany({
        where: {
            id: {
                in: data.ids,
            },
        },
    });
    return query;
};

export const auctionCatgoryQueries = {
    create,
    IsExistsActive,
    update,
    getAll,
    removeAll,
    isIdExists,
};
