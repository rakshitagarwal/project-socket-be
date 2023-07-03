import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import { IAuction } from "./typings/auction-types";

/**
 * Auction Creation
 * @param {IAuction} auction - auction request body details
 * @description creation of the auction with products
 * @param {string} userId - user ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const create = async (auction: IAuction, userId: string) => {
    // TODO: verify, auction category id and  product id and video id and image id
    const promises = await Promise.allSettled([
        auctionCatgoryQueries.IsExistsActive(auction.auction_category_id),
    ]);
    const data = promises.some((promise) => {
        if (promise.status === "fulfilled") return true;
        return false;
    });
    if (!data)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_EXISTS
        );
    const auctionData = await auctionQueries.create(auction, userId);
    if (!auctionData)
        return responseBuilder.internalserverError(
            AUCTION_MESSAGES.NOT_CREATED
        );
    return responseBuilder.createdSuccess(AUCTION_MESSAGES.CREATE);
};

export const auctionService = {
    create,
};
