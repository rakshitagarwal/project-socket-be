import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd> & {
    auction_pre_registeration_startDate: string;
};

export type IPagination = z.infer<typeof auctionSchemas.Zpagination> & {
    filter: object[];
    _sort?: string;
    _order?: string;
};

export enum auction_state {
    "upcoming",
    "live",
    "cancelled",
    "completed",
}

export type IPlayerRegister = z.infer<typeof auctionSchemas.ZPlayerRegister>;
export interface IRegisterPlayer {
    id: string;
    auction_id: string;
    player_wallet_transaction_id: string | null;
    player_id: string;
    created_at: Date;
}

export type IPurchase = z.infer<typeof auctionSchemas.ZPlayerWinner>;

export type IStartAuction = z.infer<typeof auctionSchemas.ZStartAuction>;

export type IStartSimulation = z.infer<typeof auctionSchemas.ZSimulation>;

export type IAuctionListing = z.infer<typeof auctionSchemas.ZAuctionListing>;

export interface IPlayerAuctionInfo {
    id: string;
    auction_id: string;
    player_id: string;
    status: boolean;
    title: string;
    total_bids: number;
    bid_increment_price: number;
    plays_consumed_on_bid: number;
    last_bidding_price: number;
}

export interface Bid {
    player_name: string;
    player_id: string;
    profile_image: string;
}

export interface ITotalAuctionInfo {
    auction_id: string,
    auction_name: string,
    product_name: string,
    auction_category_name: string,
    auction_start_date: Date | string,
    total_plays_live_consumed_auction: number,
    total_play_consumed_refund_after_buy_now: number,
    total_play_preregister_auction: number,
    registeration_count: number
}


export interface IRandomSimulationBot {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar: string | null;
    country: string | null;
    is_bot: boolean;
}


export interface IAuctionTotal {
    id: string,
    plays_consumed_on_bid: number,
    total_bid: number,
    total_plays_consumed: number,
    total_price: number,
    plays_lost_consumed: number,
    total_auction_register_count: number,
    registeration_count: number;
    totalAuctionProfit: number
}

export interface IAuctionTotalCount {
    total_sum_plays_live_consumed_auction: number,
    total_sum_play_consumed_refund_after_buy_now: number,
    total_sum_play_consumed_preregister: number,
    total_profitable_plays: number,
    total_profitable_currency: number
}

