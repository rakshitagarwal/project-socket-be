import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
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
    const [isAuctionCategoryFound, isProductFound] = await Promise.all([
        auctionCatgoryQueries.IsExistsActive(auction.auction_category_id),
        productQueries.getById(auction.product_id),
    ]);
    if (!isAuctionCategoryFound?.id)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    if (!isProductFound?.id)
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    if (auction.is_pregistered) {
        const newDateFormed = new Date(
            new Date(
                auction.pre_registeration_endDate as unknown as string
            ).getTime() +
                60 * 60 * 24 * 1000
        ).toISOString();
        auction = {
            ...auction,
            auction_pre_registeration_startDate: newDateFormed,
            pre_registeration_endDate: new Date(
                auction.pre_registeration_endDate as unknown as string
            ).toISOString(),
        };
    }
    console.log(auction);
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
    const [isAuctionCategoryFound, isProductExists, isAuctionExists] =
        await Promise.all([
            auctionCatgoryQueries.IsExistsActive(auction.auction_category_id),
            productQueries.getById(auction.product_id),
            auctionQueries.getActiveAuctioById(auctionId),
        ]);
    if (!isAuctionCategoryFound)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    if (!isProductExists)
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    if (!isAuctionExists)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);

    if (
        auction.start_date &&
        auction.start_date < new Date() &&
        (auction.auction_state === "live" ||
            auction.auction_state === "completed")
    ) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_STATE_NOT_STARTED
        );
    }

    if (auction.is_pregistered) {
        const newDateFormed = new Date(
            new Date(
                auction.pre_registeration_endDate as unknown as string
            ).getTime() +
                60 * 60 * 24 * 1000
        ).toISOString();
        auction = {
            ...auction,
            auction_pre_registeration_startDate: newDateFormed,
            pre_registeration_endDate: new Date(
                auction.pre_registeration_endDate as unknown as string
            ).toISOString(),
        };
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

const getBidLogs = async (id: string) => {
    const isExists = await auctionQueries.fetchAuctionLogs(id);
    //TODO: put these messages into constants, after the PR merge
    if (isExists.length) return responseBuilder.okSuccess("get logs", isExists);
    return responseBuilder.notFoundError("not bid logs found");
};

export const auctionService = {
    create,
    getById,
    getAll,
    update,
    remove,
    getBidLogs,
};
