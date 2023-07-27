export interface IBidBotInfo {
    id: string;
    player_id: string;
    auction_id: string;
    bid_limit: number;
    total_bot_bid: number;
    is_active: boolean;
}

export interface IUpdate {
    bid_limit: number;
}

export interface IBidBotQuery {
    id?: string;
    player_id?: string;
    auction_id?: string;
    bid_limit?: number;
    total_bot_bid?: number;
    is_active?: boolean;
}