import { z } from "zod";
import { auctionCategorySchemas } from "../auction-category-schemas";

export type IAuctionCategory =z.infer<typeof auctionCategorySchemas.ZAuctionCategory>;

export interface IPutAuctionCategory {
    title: string;
    status: boolean;
}

export interface IDeleteIds {
    ids: [string];
}
