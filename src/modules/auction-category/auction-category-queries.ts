import { db } from "../../config/db";
import {
    IAuctionCategory,
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
            status: true,
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

export const auctionCatgoryQueries = {
    create,
    IsExistsActive,
    update,
};
