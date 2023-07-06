import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd>;


export interface IPagination {
    limit: string | number;
    page: string | number;
    search?: string;
    filter?: object[];
  }