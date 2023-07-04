import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { IAuction } from "./typings/auction-types";

/**
 * Auction Creation
 * @param {IAuction} auction - values regarding the auction data
 * @param {string} userId = UUID regarding the created_by
 * @returns {Promise<{id: string}>}
 */
const create = async (auction: IAuction, userId: string) => {
    const query = await db.auction.create({
        data: {
            title: auction.title,
            description: auction.description as string,
            video_path: auction.auction_video,
            image_path: auction.auction_image,
            bid_increment_price: auction.price_increment,
            opening_price: auction.opening_price,
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            start_date: auction.start_date,
            is_preRegistered: auction.is_pregistered,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            terms_and_conditions: auction.terms_condition,
            state: auction.auction_state as unknown as string,
            created_by: userId,
        },
        select: {
            id: true,
        },
    });
    return query;
};

/**
 * Get Active Auction By Id
 * @param {string} id - auction id
 * @returns {Promise<IAuction>}
 */

const getActiveAuctioById = async (id: string) => {
    const query = await db.auction.findFirst({
        where: {
            id,
            is_deleted: false,
            status: true,
        },
        select: {
            id: true,
            title: true,
            description: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            new_participants_limit: true,
            start_date: true,
            is_preRegistered: true,
            registeration_fees: true,
            registeration_count: true,
            terms_and_conditions: true,
            state: true,
            status: true,
            auctionCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            auction_image: {
                select: {},
            },
            auction_video: {
                select: {},
            },
            products: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return query;
};

/**
 * Get multiple auctions
 * @param {[string]} id - multiple auction ID
 * @returns {[Promise<IAuction>]}
 */
const getMultipleActiveById = async (id: [string]) => {
    const query = await db.auction.findMany({
        where: {
            AND: {
                id: {
                    in: id,
                },
                is_deleted: false,
            },
        },
    });
    return query;
};

/**
 * Auction Update By Id with Transaction
 * @param {PrismaClient} prisma - prisma for db transaction
 * @param {IAuction} auction - auction Data
 * @param {string} auctionId - auction Id
 * @param {string} userId - user Id
 * @returns {Promise<IAuction>}
 */
const update = async (
    prisma: PrismaClient,
    auction: IAuction,
    auctionId: string,
    userId: string
) => {
    const query = await prisma.auctions.update({
        where: {
            id: auctionId,
        },
        data: {
            title: auction.title,
            description: auction.description,
            video_path: auction.auction_video,
            image_path: auction.auction_image,
            bid_increment_price: auction.price_increment,
            opening_price: auction.opening_price,
            plays_consumed_on_bid: auction.play_consumed,
            product_id: auction.product_id,
            auction_category_id: auction.auction_category_id,
            new_participants_limit: auction.new_participant_threshold,
            start_date: auction.start_date,
            is_preRegistered: auction.is_pregistered,
            registeration_count: auction.pre_register_count,
            registeration_fees: auction.pre_register_fees,
            terms_and_conditions: auction.terms_condition,
            state: auction.auction_state,
            created_by: userId,
        },
    });
    return query;
};

/**
 * Remove Auction By ID
 * @param {string} id - Auction ID
 * @returns {Promise<IAuction>} - return the auction detials
 */
const remove = async (id: [string]) => {
    const query = await db.auction.updateMany({
        where: {
            AND: {
                id: {
                    in: id,
                },
                is_deleted: false,
            },
        },
        data: {
            is_deleted: true,
        },
    });
    return query;
};

export const auctionQueries = {
    create,
    getActiveAuctioById,
    update,
    remove,
    getMultipleActiveById,
};
