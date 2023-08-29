import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd> & {
    auction_pre_registeration_startDate: string;
};

export type IPagination = z.infer<typeof auctionSchemas.Zpagination> & {
    filter: object[];
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

export interface IRandomSimulationBot {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar: string | null;
    country: string | null;
    is_bot: boolean;
}
