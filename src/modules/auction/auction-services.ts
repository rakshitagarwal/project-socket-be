import { PrismaClient } from "@prisma/client";
import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
    MESSAGES,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { prismaTransaction } from "../../utils/prisma-transactions";
import { auctionCatgoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import { IAuction } from "./typings/auction-types";
import mediaQueries from "../media/media-queries";

/**
 * Auction Creation
 * @param {IAuction} auction - auction request body details
 * @description creation of the auction with products
 * @param {string} userId - user ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const create = async (auction: IAuction, userId: string) => {
    const isAuctionCategoryFound = await auctionCatgoryQueries.IsExistsActive(
        auction.auction_category_id
    );
    if (!isAuctionCategoryFound)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    const isMediaFound = await mediaQueries.getMultipleActiveMediaByIds([
        auction.auction_image,
        auction.auction_video,
    ]);
    if (isMediaFound.length)
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    /**
     * TODO: verify, PRODUCT_ID
     */
    const auctionData = await auctionQueries.create(auction, userId);
    if (!auctionData)
        return responseBuilder.internalserverError(
            AUCTION_MESSAGES.NOT_CREATED
        );
    return responseBuilder.createdSuccess(AUCTION_MESSAGES.CREATE);
};

/**
 * Auction Update
 * @param {IAuction} auction - keys regarding the auction details
 * @param {string} auctionId -  auction Id for updating details
 * @param {string} userId - for updating the created_by
 * @returns - response builder with { code, success, message, data, metadata }
 */
const update = async (auction: IAuction, auctionId: string, userId: string) => {
    const isAuctionCategoryFound = await auctionCatgoryQueries.IsExistsActive(
        auction.auction_category_id
    );
    if (!isAuctionCategoryFound)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    const isMediaFound = await mediaQueries.getMultipleActiveMediaByIds([
        auction.auction_image,
        auction.auction_video,
    ]);
    if (isMediaFound.length)
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    /**
     * TODO: Verify ,PRODUCT_ID
     */
    const isTransactionDone = await prismaTransaction(
        async (prisma: PrismaClient) => {
            const createdAuction = await auctionQueries.update(
                prisma,
                auction,
                auctionId,
                userId
            );
            return createdAuction;
        }
    );
    if (!isTransactionDone)
        return responseBuilder.internalserverError(
            AUCTION_MESSAGES.NOT_CREATED
        );
    return responseBuilder.createdSuccess(AUCTION_MESSAGES.UPDATE);
};

/**
 * Remove Auction By Id
 * @param {string} id - auction ID
 * @returns - return {code, message, data, metadata} from responseBuilder
 */
const remove = async (id: [string]) => {
    const isExists = await auctionQueries.getMultipleActiveById(id);
    if (!isExists)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    const isDeleted = await auctionQueries.remove(id);
    if (isDeleted.count)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.REMOVE);
    return responseBuilder.internalserverError();
};

export const auctionService = {
    create,
    update,
    remove,
};
