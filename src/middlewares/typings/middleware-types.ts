import { z } from "zod";
import { auctionSchemas } from "../../modules/auction/auction-schemas";
export interface Itoken {
    id: string;
}

export type IBidAuction = z.infer<typeof auctionSchemas.ZbidAuction> & {
    is_active?: boolean;
};

export type IMinMaxAuction = z.infer<typeof auctionSchemas.ZMinMaxAuction> & {
    is_lowest?: boolean;
    is_unique?: boolean;
    is_highest?: boolean;
    created_at?: Date;
};

export interface IminMaxResult {
    player_id: string;
    auction_id: string;
    totalBid: number;
    socketId: string;
    bidHistory: IMinMaxAuction[];
    finalData: IMinMaxAuction[];
    playerInfo: IMinMaxAuction[];
    winnerInfo: IMinMaxAuction | undefined;
}
