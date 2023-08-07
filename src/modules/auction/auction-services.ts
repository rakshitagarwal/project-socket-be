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
    IPurchase,
    IRegisterPlayer,
    IStartAuction,
} from "./typings/auction-types";
import productQueries from "../product/product-queries";
import userQueries from "../users/user-queries";
import redisClient from "../../config/redis";
import eventService from "../../utils/event-service";
import { auctionState } from "@prisma/client";

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
    let state: auctionState = "upcoming";
    if (query.search) {
        query.filter?.push({
            title: { contains: query.search, mode: "insensitive" },
        });
    }
    if (query.state) {
        state = query.state as unknown as auctionState;
    }
    const auctions = await auctionQueries.getAll(query, state);
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
    if (auction.auction_state && auction.auction_state === "cancelled") {
        eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL, {
            status: "cancelled",
            auctionId,
        });
    }
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
        await redisClient.set(
            "auction:pre-register",
            JSON.stringify(newRedisObject)
        );
    } else {
        const registeredObj = JSON.parse(
            getRegisteredPlayer as unknown as string
        );
        registeredObj[`${data.auction_id + data.player_id}`] = playerRegisered;
        await redisClient.set(
            "auction:pre-register",
            JSON.stringify(registeredObj)
        );
    }
    eventService.emit(NODE_EVENT_SERVICE.AUCTION_REGISTER_COUNT, {
        auctionId: data.auction_id,
        registeration_count: auction.registeration_count,
    });
    return responseBuilder.createdSuccess(
        MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_REGISTERED
    );
};
/**
 * @param {string} player_id - The ID of the player for whom auctions are to be retrieved.
 * @param {IPagination} query - Pagination information to limit and offset the results.
 * @property {number} query.limit - The maximum number of auctions to retrieve (default is 10 if not provided).
 * @property {number} query.page - The page number to offset the results (default is 0 if not provided).
 * @returns {Promise<Object>} - A Promise that resolves to an object containing auction information.
 */
const getAllMyAuction = async (player_id: string, query: IPagination) => {
    const limit = parseInt(query.limit as unknown as string) || 10;
    const offset = parseInt(query.page as unknown as string) || 0;
    const playerAuction = await auctionQueries.fetchPlayerAuction(
        player_id,
        offset,
        limit
    );
    return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, playerAuction, {
        limit,
        page: offset,
    });
};

/**
 * Retrieves details of a player's auction.
 *
 * @async
 * @param {Object} data - An object containing player_id and auction_id for which auction details are to be retrieved.
 * @property {string} data.player_id - The ID of the player for whom the auction details are to be retrieved.
 * @property {string} data.auction_id - The ID of the auction for which the details are to be retrieved.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing auction details.
 
 */
const playerAuctionDetails = async (data: {
    player_id: string;
    auction_id: string;
}) => {
    const [auction, player, playerAuctionDetail] = await Promise.all([
        auctionQueries.getActiveAuctioById(data.auction_id),
        userQueries.fetchPlayerId(data.player_id),
        auctionQueries.getplayerRegistrationAuctionDetails(
            data.player_id,
            data.auction_id
        ),
    ]);
    if (!auction)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (!player)
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND);
    if (!playerAuctionDetail) {
        return responseBuilder.notFoundError(
            MESSAGES.USERS.PLAYER_NOT_REGISTERED
        );
    }
    const buy_now_price =
        playerAuctionDetail?.status === "won"
            ? playerAuctionDetail.PlayerBidLogs[0]?.bid_price
            : (playerAuctionDetail?.Auctions?.products
                  .price as unknown as number) -
              (playerAuctionDetail?.Auctions
                  ?.plays_consumed_on_bid as unknown as number) *
                  (playerAuctionDetail?.PlayerBidLogs as unknown as object[])
                      .length *
                  0.1;
    const { PlayerBidLogs, ...bidInfoDetails } = playerAuctionDetail;
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_FOUND, {
        ...bidInfoDetails,
        buy_now_price,
        totalBid: PlayerBidLogs.length,
    });
};

/**
 * @description for the auction start
 * @param  {IStartAuction} data - for start_date and player_id
 * @returns
 */
const startAuction = async (data: IStartAuction) => {
    const auction = await auctionQueries.getActiveAuctioById(data.auction_id);
    if (!auction) {
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    }
    const auction_updated = await auctionQueries.startAuction(data);
    if (!auction_updated.id) {
        return responseBuilder.expectationField(
            AUCTION_MESSAGES.SOMETHING_WENT_WRONG
        );
    }
    if (auction_updated.registeration_count) {
        if (
            auction_updated.PlayerAuctionRegister.length <
            auction_updated.registeration_count
        ) {
            return responseBuilder.badRequestError(
                AUCTION_MESSAGES.PLAYER_COUNT_NOT_REACHED
            );
        }
    }
    if (auction.start_date) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_ALREADY_SET
        );
    }

    if (new Date(data.start_date).getSeconds() < new Date().getSeconds()) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.DATE_NOT_PROPER
        );
    }
    eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL, {
        status: "auction_start",
        auctionId: data.auction_id,
        start_date: data.start_date,
    });
    return responseBuilder.okSuccess(AUCTION_MESSAGES.UPDATE);
};

/**
 * @description purchase product auction for the auctions
 * @param {IPurchase} data - transaction data for the product
 * @returns
 */
const purchaseAuctionProduct = async (data: IPurchase) => {
    const [isauction, isplayer, isplayerAuctionDetail] = await Promise.all([
        auctionQueries.getActiveAuctioById(data.auction_id),
        userQueries.fetchPlayerId(data.player_id),
        auctionQueries.checkPlayerRegisteration(data.player_register_id),
    ]);
    if (!isauction)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (!isplayer)
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND);
    if (!isplayerAuctionDetail) {
        return responseBuilder.notFoundError(
            MESSAGES.USERS.PLAYER_NOT_REGISTERED
        );
    }
    if (
        isplayerAuctionDetail.status === "won" ||
        isplayerAuctionDetail.status === "lost"
    ) {
        if (
            isplayerAuctionDetail.buy_now_expiration &&
            isplayerAuctionDetail.buy_now_expiration < new Date()
        ) {
            return responseBuilder.badRequestError(
                MESSAGES.TRANSACTION_CRYPTO.GET_NOW_EXPIRED
            );
        }
    }
    const createTransactionHash = await auctionQueries.createPaymentTrx(data);
    if (!createTransactionHash.id) {
        return responseBuilder.expectationField(
            MESSAGES.TRANSACTION_CRYPTO.NOT_CREATED
        );
    }
    return responseBuilder.okSuccess(
        MESSAGES.TRANSACTION_CRYPTO.CREATED_SUCCESS
    );
};

export const auctionService = {
    create,
    getById,
    getAll,
    update,
    remove,
    getBidLogs,
    playerRegister,
    startAuction,
    getAllMyAuction,
    playerAuctionDetails,
    purchaseAuctionProduct,
};
