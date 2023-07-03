import { db } from "../../config/db";
import { IAuction } from "./typings/auction-types";

/**
 * Auction Creation
 * @param {IAuction} auction - values regarding the auction data
 * @param {string} userId = UUID regarding the created_by
 * @returns the UUID for auction creation
 */
const create = async (auction: IAuction, userId: string) => {
    const query = await db.auction.create({
        data: {
            title: auction.title,
            description: auction.description as string,
            image_path: auction.auction_image,
            video_path: auction.auction_video,
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
 * Auction Retrieve
 * @description retrieval of one auction using its unique id
 * @param {string} id - UUID regarding the auction
 * @returns - if auction is found, then query result is auction object
 */
const getById = async function (id: string) {
    const query = await db.auction.findFirst({
        where: { id },
        select: {
            id: true,
            title: true,
            description: true,
            image_path: true,
            video_path: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            new_participants_limit: true,
            start_date: true,
            registeration_count: true,
            registeration_fees: true,
            terms_and_conditions: true,
            auctionCategory: true,
            products: true,
            auctionMedia: true,
        },
    });
    return query;
};

/**
 * Auction Retrieve
 * @description retrieval of all auctions
 * @returns - all auction entities
 */
const getAll = async () => {
    const query = await db.auction.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            image_path: true,
            video_path: true,
            bid_increment_price: true,
            plays_consumed_on_bid: true,
            opening_price: true,
            new_participants_limit: true,
            start_date: true,
            registeration_count: true,
            registeration_fees: true,
            terms_and_conditions: true,
            auctionCategory: true,
            products: true,
            auctionMedia: true,
        },
    });
    return query;
};

export const auctionQueries = {
    create,
    getById,
    getAll,
};
