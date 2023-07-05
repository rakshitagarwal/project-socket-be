import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd>;

export interface Ipagination {
    limit: string
    page: string
    search: string
}

export interface IpaginationQuery {
    limit: number
    page: number
    filter: Array<Object>
}
