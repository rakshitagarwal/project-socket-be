import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
    MESSAGES,
    productMessage,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import { IAuction, IPagination } from "./typings/auction-types";
import mediaQueries from "../media/media-queries";
import productQueries from "../product/product-queries";
import { prismaTransaction } from "../../utils/prisma-transactions";
import { PrismaClient } from "@prisma/client";

/**
 * Auction Creation
 * @param {IAuction} auction - auction request body details
 * @description creation of the auction with products
 * @param {string} userId - user ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const create = async (auction: IAuction, userId: string) => {
    const [isAuctionCategoryFound, isMediaFound, isProductFound] =
        await Promise.all([
            auctionCatgoryQueries.IsExistsActive(auction.auction_category_id),
            mediaQueries.getMultipleActiveMediaByIds([
                auction.auction_image,
                auction.auction_video,
            ]),
            productQueries.getById(auction.product_id),
        ]);
    if (!isAuctionCategoryFound?.id)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    const medias = isMediaFound.map((media) => media.type);
    if (!medias.includes("image")) {
        return responseBuilder.notFoundError(
            MESSAGES.MEDIA.AUCTION_IMAGE_NOT_FOUND
        );
    }
    if (!medias.includes("video")) {
        return responseBuilder.notFoundError(
            MESSAGES.MEDIA.AUCTION_VIDEO_NOT_FOUND
        );
    }
    if (!isProductFound?.id)
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    const auctionData = await auctionQueries.create(auction, userId);
    if (!auctionData)
        return responseBuilder.expectationField(AUCTION_MESSAGES.NOT_CREATED);
    return responseBuilder.createdSuccess(AUCTION_MESSAGES.CREATE);
};

/**
 * Auction Retrieve
 * @description retrieval of one auction using its unique id
 * @param {string} auctionId - auction ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const getById = async (auctionId: string) => {
    const auction = await auctionQueries.getActiveAuctioById(auctionId);
    if (!auction)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, auction);
};

/**
 * Auction Retrieve
 * @description retrieval of all auctions
 * @param {IPagination} query - pagination query
 * @returns - response builder with { code, success, message, data, metadata }
 */
const getAll = async (query: IPagination) => {
    if (query.search) {
        query.filter?.push({
            title: { contains: query.search, mode: "insensitive" },
        });
    }
    const auctions = await auctionQueries.getAll(query);
    return responseBuilder.okSuccess(
        AUCTION_MESSAGES.FOUND,
        auctions.queryResult,
        {
            limit: +query.limit,
            page: +query.page,
            totalRecord: auctions.queryCount,
            totalPage: Math.ceil(auctions.queryCount / +query.limit),
            search: query.search,
        }
    );
};

/**
 * Auction Update
 * @description auction updation with the data
 * @param {IAuction} auction - keys regarding the auction details
 * @param {string} auctionId -  auction Id for updating details
 * @param {string} userId - for updating the created_by
 * @returns - response builder with { code, success, message, data, metadata }
 */
const update = async (
    auction: IAuction & {
        status: boolean;
    },
    auctionId: string,
    userId: string
) => {
    const [isAuctionCategoryFound, isMediaFound, isProductExists] =
        await Promise.all([
            auctionCatgoryQueries.IsExistsActive(auction.auction_category_id),
            mediaQueries.getMultipleActiveMediaByIds([
                auction.auction_image,
                auction.auction_video,
            ]),
            productQueries.getById(auction.product_id),
        ]);
    if (!isAuctionCategoryFound)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    if (isMediaFound.length !== 2)
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    if (!isProductExists)
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);

    if (
        auction.start_date < new Date() &&
        (auction.auction_state === "live" ||
            auction.auction_state === "completed")
    ) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_STATE_NOT_STARTED
        );
    }

    const createdAuction = await auctionQueries.update(
        auction,
        auctionId,
        userId
    );
    if (!createdAuction)
        return responseBuilder.expectationField(AUCTION_MESSAGES.NOT_CREATED);
    return responseBuilder.createdSuccess(AUCTION_MESSAGES.UPDATE);
};

/**
 * Remove Auction By Id
 * @param {string} id - auction ID
 * @returns - return {code, message, data, metadata} from responseBuilder
 */
const remove = async (id: string[]) => {
    const isExists = await auctionQueries.getMultipleActiveById(id);
    if (!isExists.length)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    const isTransactioned = await prismaTransaction(
        async (prisma: PrismaClient) => {
            const isDeleted = await auctionQueries.remove(prisma, id);
            const isMediaDeleted = await mediaQueries.softdeletedByIds(
                prisma,
                id
            );
            return { isDeleted, isMediaDeleted };
        }
    );
    if (isTransactioned.isDeleted && isTransactioned.isMediaDeleted)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.REMOVE);
    return responseBuilder.expectationField();
};

export const auctionService = {
    create,
    getById,
    getAll,
    update,
    remove,
};
