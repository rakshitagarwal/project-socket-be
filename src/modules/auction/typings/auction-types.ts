import { z } from "zod";
import { auctionSchemas } from "../auction-schemas";

export type IAuction = z.infer<typeof auctionSchemas.ZAuctionAdd>;
