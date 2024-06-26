import {
    AUCTION_CATEGORY_MESSAGES,
    AUCTION_MESSAGES,
    MESSAGES,
    productMessage,
    NODE_EVENT_SERVICE,
    // ONE_PLAY_VALUE_IN_DOLLAR,
    SOCKET_EVENT,
    TEMPLATE,
} from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { auctionCategoryQueries } from "../auction-category/auction-category-queries";
import { auctionQueries } from "./auction-queries";
import {
    IAuction,
    IAuctionListing,
    IAuctionTotal,
    IAuctionTotalCount,
    IPagination,
    IPlayerRegister,
    IPurchase,
    IRegisterPlayer,
    IStartAuction,
    IStartSimulation,
    ITotalAuctionInfo,
} from "./typings/auction-types";
import productQueries from "../product/product-queries";
import userQueries from "../users/user-queries";
import redisClient from "../../config/redis";
import eventService from "../../utils/event-service";
// import { AUCTION_STATE } from "../../utils/typing/utils-types";
import { AppGlobal } from "../../utils/socket-service";
import { Ispend_on } from "../users/typings/user-types";
import { prismaTransaction } from "../../utils/prisma-transactions";
import { PlaySpend, PrismaClient } from "@prisma/client";
import { mailService } from "../../utils/mail-service";
const socket = global as unknown as AppGlobal;

/**
 * Auction Creation
 * @param {IAuction} auction - auction request body details
 * @description creation of the auction with products
 * @param {string} userId - user ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const create = async (auction: IAuction, userId: string) => {
    const [isAuctionCategoryFound, isProductFound] = await Promise.all([
        auctionCategoryQueries.IsExistsActive(auction.auction_category_id),
        productQueries.getById(auction.product_id),
    ]);
    if (!isAuctionCategoryFound?.id)
        return responseBuilder.notFoundError(
            AUCTION_CATEGORY_MESSAGES.NOT_FOUND
        );
    if (!isProductFound?.id)
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
   const newAuction= await auctionQueries.create(auction, userId);
   socket.playerSocket.emit(SOCKET_EVENT.NEW_AUCTION_ADDED,{message:MESSAGES.SOCKET.NEW_AUCTION_ADDED, data:newAuction})
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
    query._sort = query._sort || "category";
    query._order = query._order || "asc";
    query.limit = +query.limit || 10;
    query.page = +query.page || 0;
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
            sort: query._sort,
            order: query._order,
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
    const [isAuctionCategoryFound, isAuctionExists] = await Promise.all([
        auctionCategoryQueries.IsExistsActive(auction.auction_category_id),
        auctionQueries.getActiveAuctioById(auctionId),
    ]);
    if (!isAuctionCategoryFound)
        return responseBuilder.notFoundError(AUCTION_CATEGORY_MESSAGES.NOT_FOUND);
    if(isAuctionCategoryFound.code !=="TLP" && !auction.decimal_count && !auction.total_bids){
        return responseBuilder.badRequestError(AUCTION_MESSAGES.TOTAL_BID_DECIMAL_VALUE)
    }
    if (!isAuctionExists)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (isAuctionExists.state === "live")
        return responseBuilder.badRequestError(AUCTION_MESSAGES.AUCTION_LIVE_UPDATE);
    if (isAuctionExists.state === "completed")
        return responseBuilder.badRequestError(AUCTION_MESSAGES.AUCTION_COMPLETED_UPDATE);
    if (auction.start_date && auction.start_date > new Date())
        return responseBuilder.badRequestError(AUCTION_MESSAGES.AUCTION_ALREADY_STARTED);

    await auctionQueries.update(auction, auctionId, userId);
    if (auction.auction_state && auction.auction_state === "cancelled") {
        eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL, {
            status: "cancelled",
            auctionId,
        });
    }
    return responseBuilder.okSuccess(AUCTION_MESSAGES.UPDATE);
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
    if (isExists.state === "completed") {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.AUCTION_COMPLETED_UPDATE
        );
    }
    const isDeleted = await auctionQueries.remove(id);
    if (isDeleted.count)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.REMOVE);
    return responseBuilder.expectationFaild(
        AUCTION_MESSAGES.CANNOT_DELETE_AUCTION
    );
};

/**
 * @description cancel an auction by its id
 * @param {string} id - auction ID passed by params in request
 * @returns - return {code, message, data, metadata} from responseBuilder
 */
const cancelAuction = async (id: string) => {
    const isExists = await auctionQueries.getAuctionById(id);
    if (!isExists?.id)
        return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
    if (
        isExists.state === "live" ||
        isExists.state === "completed" ||
        isExists.state === "cancelled"
    )
        return responseBuilder.badRequestError(AUCTION_MESSAGES.CANT_CANCEL);

    const createTrax = await prismaTransaction(async (prisma: PrismaClient) => {
        const cancelAuction = await prisma.auctions.update({
            where: { id },
            data: { state: "cancelled" },
        });
        if (cancelAuction.is_preRegistered) {
            const checkPlayers = await auctionQueries.findPlayersRegistered(
                id,
                prisma
            );
            const emails: string[] = [];
            const userIds: string[] = [];
            const refundData = checkPlayers.map((player) => {
                userIds.push(player.player_id);
                emails.push(player.User.email);
                return {
                    created_by: player.player_id,
                    spend_on: PlaySpend.REFUND_PLAYS,
                    auction_id: id,
                    play_credit: cancelAuction?.registeration_fees as number,
                };
            });
            await prisma.playerWalletTransaction.createMany({ data: refundData });
            await eventService.emit(NODE_EVENT_SERVICE.PLAYERS_PLAYS_BALANCE_REFUND, {
                player_ids: userIds,
                plays_balance: cancelAuction.registeration_fees,
            });
            return { cancelAuction, emails, userIds };
        }
        return { cancelAuction };
    });

    if (createTrax) {
        if (createTrax.cancelAuction.is_preRegistered) {
            if (createTrax.emails.length) {
                const mailData = {
                    email: createTrax.emails,
                    template: TEMPLATE.PLAYER_REGISTERATION,
                    subject: `Auction Cancelled: ${createTrax.cancelAuction.title}`,
                    message: `${createTrax.cancelAuction.title} is canceled and your ${createTrax.cancelAuction.registeration_fees} plays are refunded `,
                };
                await mailService(mailData);
            }
            await redisClient.del(`auction:pre-register:${id}`);
        }
        socket.playerSocket.emit(SOCKET_EVENT.NEW_AUCTION_ADDED,{message:MESSAGES.SOCKET.NEW_AUCTION_ADDED, data:createTrax.cancelAuction})
        return responseBuilder.okSuccess(AUCTION_MESSAGES.CANCELLED);
    }
    return responseBuilder.expectationFaild(AUCTION_MESSAGES.CANT_CANCEL);
};

const getBidLogs = async (id: string,query: IPagination) => {
    const limit= +query.limit||20
    const page= +query.page||0
    const isExists = await auctionQueries.fetchAuctionLogs(id,{limit,page});
    if (isExists.query && isExists.count)
        return responseBuilder.okSuccess(
            AUCTION_MESSAGES.GET_BID_LOGS,
            isExists.query,
            {
                limit,
                totalRecord: isExists.count,
                totalPage: Math.ceil(isExists.count / limit),
                page,
            }
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
    if (!auction.is_preRegistered) {
        return responseBuilder.badRequestError(
            AUCTION_MESSAGES.PRE_REGISTER_ERROR
        );
    }
    const playerRegisered = await auctionQueries.playerAuctionRegistered(data);
    if (!playerRegisered.id)
        return responseBuilder.expectationFaild(
            MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_NOT_REGISTERED
        );
    await userQueries.playerWalletTxcn(
        data.auction_id,
        data.player_wallet_transaction_id
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
    if (auction && auction.registeration_count) {
        const auctionData = await auctionQueries.auctionRegistrationCount(
            data.auction_id
        );

        eventService.emit(NODE_EVENT_SERVICE.PLAYER_AUCTION_REGISTER_MAIL, {
            user_name: player.first_name,
            email: player.email,
            auctionName: auction.title,
            registeration_count: auction.registeration_count,
            _count: auction._count.PlayerAuctionRegister + 1,
        });
        socket.playerSocket.emit(SOCKET_EVENT.AUCTION_REGISTER_COUNT, {
            message: MESSAGES.SOCKET.TOTAL_AUCTION_REGISTERED,
            data: {
                auction_registration_percentage:
                    (auctionData * 100) / auction.registeration_count,
                auctionId: data.auction_id,
            },
        });
    }

    return responseBuilder.createdSuccess(
        MESSAGES.PLAYER_AUCTION_REGISTEREATION.PLAYER_REGISTERED
    );
};

/**
 * @description - register player in open auction
 * @param {{auction_id: string, player_id: string}} data - auction and player data
 * @returns
 */
const playerOpenAuctionRegister = async (data: {
    auction_id: string;
    player_id: string;
}) => {
    const player = await userQueries.fetchPlayerId(data.player_id);
    if (!player) return;
    const playerRegisered = await auctionQueries.playerOpenAuctionRegister(
        data
    );
    if (!playerRegisered) return;
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
    return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, playerAuction.queryResult, {
        limit,
        totalRecord: playerAuction.count,
        totalPage: Math.ceil(playerAuction.count / limit),
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
            ? playerAuctionDetail.Auctions?.auctionCategory.code !== "TLP"
                ? playerAuctionDetail.PlayerBidLogs.find(
                    (val) =>
                        (val.is_highest && val.is_unique) ||
                        (val.is_lowest && val.is_unique)
                )?.bid_price
                : playerAuctionDetail.PlayerBidLogs[0]?.bid_price
            : playerAuctionDetail.Auctions.products.price;
    /*-
              playerAuctionDetail.Auctions.plays_consumed_on_bid *
                  playerAuctionDetail?.PlayerBidLogs.length *
                  ONE_PLAY_VALUE_IN_DOLLAR;*/
    const { PlayerBidLogs, ...bidInfoDetails } = playerAuctionDetail;
    let winnerInfoDetails;
    if (winnerInfo?.status === "won") {
        const { PlayerBidLogs, ...winnerInfoData } = winnerInfo;
        let buy_now_price = PlayerBidLogs[0]?.bid_price;

        if (bidInfoDetails.Auctions?.auctionCategory.code !== "TLP") {
            buy_now_price = PlayerBidLogs.find(
                (val) =>
                    (val.is_highest && val.is_unique) ||
                    (val.is_lowest && val.is_unique)
            )?.bid_price;
        }
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
    // if (auction.registeration_count) {
    //     if (
    //         auction._count.PlayerAuctionRegister < auction.registeration_count
    //     ) {
    //         return responseBuilder.badRequestError(
    //             AUCTION_MESSAGES.PLAYER_COUNT_NOT_REACHED
    //         );
    //     }
    // }
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

    if (isplayerAuctionDetail.payment_status === "success") {
        return responseBuilder.badRequestError(
            MESSAGES.TRANSACTION_CRYPTO.ALREADY_PURCHASE_PRODUCT
        );
    }

    if (isplayerAuctionDetail.status === "lost") {
        const transferred_plays = await auctionQueries.transferLastPlay(
            isauction.id,
            isplayerAuctionDetail.player_id
        );
        const totalPlays = Number(transferred_plays[0]?.total_plays);
        const lastPlaysAdd = {
            auction_id: data.auction_id,
            player_id: data.player_id,
            plays: totalPlays,
            spends_on: Ispend_on.REFUND_PLAYS
        };
        await userQueries.addLastPlaysTrx(lastPlaysAdd);
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
    // if (filter.auction_id) {
    //     const auction = await auctionQueries.getPlayerAuctionDetailsById(
    //         filter.player_id,
    //         filter.auction_id,
    //         filter.state as AUCTION_STATE
    //     );
    //     return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, [auction], {});
    // }

    const auctions = await auctionQueries.getAuctionLists(filter);
    let index = filter.page;
    if (filter.auction_id) {
        index = auctions.queryCount.findIndex(
            (val) => val.id === filter.auction_id
        );
    }
    return responseBuilder.okSuccess(
        AUCTION_MESSAGES.FOUND,
        auctions.queryResult,
        {
            ...filter,
            page: index,
            totalRecord: auctions.queryCount.length,
            totalPage: Math.ceil(auctions.queryCount.length / filter.limit),
        }
    );
};

/**
 * Auction Retrieve Total
 * @description retrieval of one auction using its unique id
 * @param {string} auctionId - auction ObjectID
 * @returns - response builder with { code, success, message, data, metadata }
 */
const getByIdTotalAuction = async (auctionId: string) => {
    const auction: IAuctionTotal[] =
        await auctionQueries.getInformationAuctionById(auctionId);
    if (auction.length)
        return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, auction);
    return responseBuilder.notFoundError(AUCTION_MESSAGES.NOT_FOUND);
};

/**
 * @description Create total information for an auction listing.
 * @param {IAuctionListing} data - The data to create the auction listing information.
 */
const auctionListsTotal = async (data: IAuctionListing) => {
    const limit = data.limit || 10;
    const offset = data.page || 0;
    const listAuction: ITotalAuctionInfo[] =
        await auctionQueries.getListTotalAuction(offset, limit);
    const listAuctionCount=
        await auctionQueries.getListTotalAuctionCount();
    return responseBuilder.okSuccess(
        listAuction.length
            ? AUCTION_MESSAGES.FOUND
            : AUCTION_MESSAGES.NOT_FOUND,
        listAuction,
        {
            totalRecord: listAuctionCount,
            totalPage: Math.ceil(listAuctionCount / limit) || 0,
            page: offset,
            limit: limit,
        }
    );
};

/**
 *  @description Get global statistics for total auctions.!
 */
const auctionTotal = async () => {
    const getAuctionCounts: IAuctionTotalCount[] =
        await auctionQueries.getTotalAuction();
    return responseBuilder.okSuccess(AUCTION_MESSAGES.FOUND, getAuctionCounts);
};

/**
 * Get all auctions for a grid with pagination.
 * @param {IPagination} query - The pagination and filtering parameters.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the results and pagination info.
 * @throws {Error} Throws an error if the query is invalid or the database operation fails.
 */
const getAllAuctionforGrid = async (query: IPagination,player_id:"") => {
    query.limit = 20;
    query.page = 0;
    query._sort = "created_at",
    query._order = "asc"
    const liveAuction = await auctionQueries.getAuctionLists({ ...query,state:"live",player_id});
    const upcomingAuction = await auctionQueries.getAuctionLists({ ...query ,state:"upcoming",player_id});

    const data = [...liveAuction.queryResult, ...upcomingAuction.queryResult]
    return responseBuilder.okSuccess(
        AUCTION_MESSAGES.FOUND,
        data,
        {
            search: query.search,
        }
    );
};

export const auctionService = {
    create,
    getById,
    getAll,
    update,
    remove,
    cancelAuction,
    getBidLogs,
    playerRegister,
    playerOpenAuctionRegister,
    startAuction,
    getAllMyAuction,
    playerAuctionDetails,
    purchaseAuctionProduct,
    startSimulation,
    auctionLists,
    getByIdTotalAuction,
    auctionListsTotal,
    auctionTotal,
    getAllAuctionforGrid,
};
