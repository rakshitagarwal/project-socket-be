export interface IBidBotInfo {
    id: string;
    player_id: string;
    auction_id: string;
    plays_limit: number;
    total_bot_bid: number;
    is_active: boolean;
    player_bot_id: string | undefined;
}

export interface IUpdate {
    plays_limit: number;
}

export interface IBidBotQuery {
    id?: string;
    player_id?: string;
    auction_id?: string;
    plays_limit?: number;
    total_bot_bid?: number;
    is_active?: boolean;
}