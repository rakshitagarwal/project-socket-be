import { AUCTION_CATEGORY_MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "./auction-category-queries";
import {
    IAuctionCategory,
    IDeleteIds,
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

/**
 * @param {string} id - auction category id
 * @description - it used for getting the single auction details
 * @returns response builder which contain {code, message, data, metadata}
 */
const get = async (id: string) => {
    const isExists = await auctionCatgoryQueries.IsExistsActive(id);
    if (!isExists?.id)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    return responseBuilder.okSuccess(AUCTION_CATEGORY_MESSAGES.GET_SINGLE);
};

/**
 * @description - getting the details of the auction category
 * @returns response build which contains {code, message, data, metadata}
 */
const getAll = async () => {
    const allDetails = await auctionCatgoryQueries.getAll();
    return responseBuilder.okSuccess(
        AUCTION_CATEGORY_MESSAGES.GET_SINGLE,
        allDetails
    );
};

/**
 * @param {IDeleteIds} data - multiple ids in the object
 * @description - remove the multiple ids from auction categories
 * @returns response builder contains {code, message, data, metadata}
 */
const removeCategories = async (data: IDeleteIds) => {
    const IsExists = await auctionCatgoryQueries.isIdExists(data);
    if (!IsExists.length) return responseBuilder.notFoundError();
    const removeDetail = await auctionCatgoryQueries.removeAll(data);
    if (removeDetail.count) return responseBuilder.okSuccess();
    return responseBuilder.internalserverError();
};

export const auctionCatgoryService = {
    add,
    update,
    get,
    getAll,
    removeCategories,
};
