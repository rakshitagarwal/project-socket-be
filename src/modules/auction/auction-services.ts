import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
    MESSAGES,
    productMessage,
    NODE_EVENT_SERVICE,
    ONE_PLAY_VALUE_IN_DOLLAR,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCatgoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import {
    IAuction,
    IAuctionListing,
    IPagination,
    IPlayerRegister,
    IPurchase,
    IRegisterPlayer,
    IStartAuction,
    IStartSimulation,
} from "./typings/auction-types";
import productQueries from "../product/product-queries";
import userQueries from "../users/user-queries";
import redisClient from "../../config/redis";
import eventService from "../../utils/event-service";
import { AUCTION_STATE } from "../../utils/typing/utils-types";

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
    await auctionQueries.create(auction, userId);
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
    const filter = [];
    if (query.search) {
        filter?.push({
            title: { contains: query.search, mode: "insensitive" },
        });
    }
    if (query.state) {
        filter?.push({
            state: query.state,
        });
    }
    query = { ...query, filter: filter };
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
            state: query.state,
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
            AUCTION_MESSAGES.AUCTION_LIVE_UPDATE
        );
    await auctionQueries.update(auction, auctionId, userId);
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
    return responseBuilder.expectationFaild(
        AUCTION_MESSAGES.CANNOT_DELETE_AUCTION
    );
};

const getBidLogs = async (id: string) => {
    const isExists = await auctionQueries.fetchAuctionLogs(id);
    if (isExists.length)
        return responseBuilder.okSuccess(
            AUCTION_MESSAGES.GET_BID_LOGS,
            isExists
        );
    return responseBuilder.notFoundError(AUCTION_MESSAGES.BID_LOGS_NOT_FOUND);
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
            .data({})
            .metaData({})
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
        return responseBuilder.expectationFaild(
            MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_NOT_REGISTERED
        );
    const newRedisObject: { [id: string]: IRegisterPlayer } = {};
    const getRegisteredPlayer = await redisClient.get(
        `auction:pre-register:${data.auction_id}`
    );
    if (!getRegisteredPlayer) {
        newRedisObject[`${data.auction_id + data.player_id}`] = playerRegisered;
        await redisClient.set(
            `auction:pre-register:${data.auction_id}`,
            JSON.stringify(newRedisObject)
        );
    } else {
        const registeredObj = JSON.parse(getRegisteredPlayer);
        registeredObj[`${data.auction_id + data.player_id}`] = playerRegisered;
        await redisClient.set(
            `auction:pre-register:${data.auction_id}`,
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
    const limit = +query.limit || 10;
    const offset = +query.page || 0;
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
    const [auction, player, playerAuctionDetail, winnerInfo] =
        await Promise.all([
            auctionQueries.getActiveAuctioById(data.auction_id),
            userQueries.fetchPlayerId(data.player_id),
            auctionQueries.getplayerRegistrationAuctionDetails(
                data.player_id,
                data.auction_id
            ),
            auctionQueries.getAuctionWinnerInfo(data.auction_id),
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

    if (!playerAuctionDetail || !playerAuctionDetail.Auctions) {
        return responseBuilder.internalserverError();
    }
    const buy_now_price =
        playerAuctionDetail.status === "won"
            ? playerAuctionDetail.PlayerBidLogs[0]?.bid_price
            : playerAuctionDetail.Auctions.products.price -
              playerAuctionDetail.Auctions.plays_consumed_on_bid *
                  playerAuctionDetail?.PlayerBidLogs.length *
                  ONE_PLAY_VALUE_IN_DOLLAR;
    const { PlayerBidLogs, ...bidInfoDetails } = playerAuctionDetail;
    let winnerInfoDetails;
    if (winnerInfo?.status === "won") {
        const { PlayerBidLogs, ...winnerInfoData } = winnerInfo;
        const buy_now_price = PlayerBidLogs[0]?.bid_price;
        winnerInfoDetails = {
            buy_now_price,
            totalBid: PlayerBidLogs.length,
            ...winnerInfoData,
        };
    }
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_FOUND, {
        ...bidInfoDetails,
        winnerInfo: winnerInfoDetails || {},
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

    if (!auction.id) {
        return responseBuilder.expectationFaild(
            AUCTION_MESSAGES.SOMETHING_WENT_WRONG
        );
    }
    if (auction.start_date) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_ALREADY_SET
        );
    }
    // FIXME: You can't compare strings :/
    if (new Date(data.start_date).toISOString() < new Date().toISOString()) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.DATE_NOT_PROPER
        );
    }
    if (auction.registeration_count) {
        if (
            auction._count.PlayerAuctionRegister < auction.registeration_count
        ) {
            return responseBuilder.badRequestError(
                AUCTION_MESSAGES.PLAYER_COUNT_NOT_REACHED
            );
        }
    }
    const auction_updated = await auctionQueries.startAuction(data);
    eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL, {
        status: "auction_start",
        auctionId: data.auction_id,
        start_date: data.start_date,
    });
    if (auction_updated.id)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.UPDATE);
    return responseBuilder.okSuccess(AUCTION_MESSAGES.SOMETHING_WENT_WRONG);
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
    if (isauction.state !== "completed") {
        return responseBuilder.badRequestError(
            MESSAGES.TRANSACTION_CRYPTO.AUCTION_NOT_COMPELETED
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
    await auctionQueries.updatetRegisterPaymentStatus(data.player_register_id);
    if (!createTransactionHash.id) {
        return responseBuilder.expectationFaild(
            MESSAGES.TRANSACTION_CRYPTO.NOT_CREATED
        );
    }
    return responseBuilder.okSuccess(
        MESSAGES.TRANSACTION_CRYPTO.CREATED_SUCCESS
    );
};

/**
 * @description the start simulation of the auctions
 * @param {IStartSimulation} data
 */
const startSimulation = async (data: IStartSimulation) => {
    if (!data.bot_status) {
        eventService.emit(
            NODE_EVENT_SERVICE.STOP_BOT_SIMULATIONS,
            data.bot_status
        );
        return responseBuilder.okSuccess(AUCTION_MESSAGES.SIMULATION_STOPPED);
    }
    eventService.emit(NODE_EVENT_SERVICE.START_SIMULATION_LIVE_AUCTION, data);
    return responseBuilder.okSuccess(AUCTION_MESSAGES.SIMULATION_STARTED);
};

/**
 * @description created the auction listing
 * @param {IAuctionListing} data
 */
const auctionLists = async (data: IAuctionListing) => {
    let filter: IAuctionListing = {
        page: +data.page || 0,
        limit: +data.limit || 1,
        player_id: data.player_id,
    };
    if (data.auction_id) {
        filter = { ...filter, auction_id: data.auction_id };
    }
    if (data.state) {
        filter = { ...filter, state: data.state };
    }
    if (filter.auction_id) {
        const auction = await auctionQueries.getPlayerAuctionDetailsById(
            filter.player_id,
            filter.auction_id,
            filter.state as AUCTION_STATE
        );
        return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, [auction], {});
    }
    const auctions = await auctionQueries.getAuctionLists(filter);
    return responseBuilder.okSuccess(
        AUCTION_MESSAGES.FOUND,
        auctions.queryResult,
        {
            ...filter,
            totalRecord: auctions.queryCount,
            totalPage: Math.ceil(auctions.queryCount / filter.limit),
        }
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
    startSimulation,
    auctionLists,
};
