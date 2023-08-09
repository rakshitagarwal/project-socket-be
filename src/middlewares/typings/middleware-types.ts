import { z } from "zod";
import { auctionSchemas } from "../../modules/auction/auction-schemas";
export interface Itoken {
    id: string;
}

export type IBidAuction = z.infer<typeof auctionSchemas.ZbidAuction> & {
    is_active?: boolean;
};
