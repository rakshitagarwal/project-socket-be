import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd> & {
    auction_pre_registeration_startDate: string;
};

export interface IPagination {
    limit: string | number;
    page: string | number;
    search?: string;
    filter?: object[];
}

export type IPlayerRegister = z.infer<typeof auctionSchemas.ZPlayerRegister>;
export interface IRegisterPlayer {
    id: string;
    auction_id: string;
    player_wallet_transaction_id: string | null;
    player_id: string;
    created_at: Date;
}

export type IStartAuction = z.infer<typeof auctionSchemas.ZStartAuction>;
