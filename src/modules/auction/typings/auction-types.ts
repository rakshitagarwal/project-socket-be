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
