import { AUCTION_CATEGORY_MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "./auction-category-queries";
import {
    IAuctionCategory,
    IPutAuctionCategory,
} from "./typings/auction-category-types";

/**
 * @param {IAuctionCategory} auctionCategory  - auction category data creation
 * @description - data for the auction category
 * @return response builder which contian {code, success ,message, data , metadata}
 */
const add = async (auctionCategory: IAuctionCategory) => {
    const data = await auctionCatgoryQueries.create(auctionCategory);
    if (data.id)
        return responseBuilder.createdSuccess(AUCTION_CATEGORY_MESSAGES.ADD);
    return responseBuilder.internalserverError();
};

/**
 * @param {string} id - auction category id
 * @param {IPutAuctionCategory} auctionCategory - auction data object contain title and status
 * @description - it used for updating the auction status and category
 * @returns response builder which contain {code, message, data , metadata}
 */
const update = async (id: string, auctionCategory: IPutAuctionCategory) => {
    const isExists = await auctionCatgoryQueries.IsExistsActive(id);
    if (!isExists?.id) {
        return responseBuilder.badRequestError(
            AUCTION_CATEGORY_MESSAGES.NOT_EXISTS
        );
    }
    const updation = await auctionCatgoryQueries.update(id, auctionCategory);
    if (updation.id)
        return responseBuilder.okSuccess(AUCTION_CATEGORY_MESSAGES.UPDATE);
    return responseBuilder.internalserverError();
};

export const auctionCatgoryService = {
    add,
    update,
};
