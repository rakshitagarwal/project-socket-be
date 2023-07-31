import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
    MESSAGES,
    productMessage,
    NODE_EVENT_SERVICE,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import {
    IAuction,
    IPagination,
    IPlayerRegister,
    IRegisterPlayer,
} from "./typings/auction-types";
import productQueries from "../product/product-queries";
import userQueries from "../users/user-queries";
import redisClient from "../../config/redis";
import eventService from "../../utils/event-service";

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

    if (auction.start_date && auction.start_date > new Date()) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_ALREADY_STARTED
        );
    }
    if (isAuctionExists.state === "live")
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_LIVE_DELETE
        );
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
    if (!isExists?.id)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (isExists.state === "live")
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_LIVE_DELETE
        );
    const isDeleted = await auctionQueries.remove(id);
    if (isDeleted.count)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.REMOVE);
    return responseBuilder.expectationField();
};

const getBidLogs = async (id: string) => {
    const isExists = await auctionQueries.fetchAuctionLogs(id);
    //TODO: put these messages into constants, after the PR merge
    if (isExists.length) return responseBuilder.okSuccess("get logs", isExists);
    return responseBuilder.notFoundError("not bid logs found");
};

/**
 * @description - register the auction player
 * @param {IPlayerRegister} data - auction pre-registeration data
 * @returns
 */
const playerRegister = async (data: IPlayerRegister) => {
    const [auction, player, walletTransaction, existsInAuction] =
        await Promise.all([
            auctionQueries.getActiveAuctioById(data.auction_id),
            userQueries.fetchPlayerId(data.player_id),
            userQueries.getPlayerTrxById(
                data.player_id,
                data.player_wallet_transaction_id
            ),
            auctionQueries.checkIfPlayerExists(data.player_id, data.auction_id),
        ]);
    if (existsInAuction.length)
        return responseBuilder
            .error(403)
            .message(
                MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_ALREADY_EXISTS
            )
            .build();

    if (!auction)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (!player)
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND);
    if (!walletTransaction)
        return responseBuilder.notFoundError(
            MESSAGES.PLAYER_WALLET_TRAX.PLAYER_TRAX_NOT_FOUND
        );
    const playerRegisered = await auctionQueries.playerAuctionRegistered(data);
    if (!playerRegisered.id)
        return responseBuilder.expectationField(
            MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_NOT_REGISTERED
        );
    const newRedisObject: { [id: string]: IRegisterPlayer } = {};
    const getRegisteredPlayer = await redisClient.get("auction:pre-register");
    if (!getRegisteredPlayer) {
        newRedisObject[`${data.auction_id + data.player_id}`] = playerRegisered;
        await redisClient.set("auction:pre-register",JSON.stringify(newRedisObject));
    } else {
        const registeredObj = JSON.parse(getRegisteredPlayer as unknown as string);
        registeredObj[`${data.auction_id + data.player_id}`] = playerRegisered;
        await redisClient.set("auction:pre-register",JSON.stringify(registeredObj));
    }
    eventService.emit(NODE_EVENT_SERVICE.AUCTION_REGISTER_COUNT, {
        auctionId: data.auction_id,
        registeration_count: auction.registeration_count,
    });
    return responseBuilder.okSuccess(
        MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_REGISTERED
    );
};

const getAllMyAuction = async (player_id: string) => {
    const playerAuction = await auctionQueries.fetchPlayerAuction(player_id) ;
    console.log(playerAuction)
    return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND);
};


export const auctionService = {
    create,
    getById,
    getAll,
    update,
    remove,
    getBidLogs,
    playerRegister,
    getAllMyAuction,
};
