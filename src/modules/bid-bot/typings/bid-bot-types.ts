export interface IBidBotInfo {
    id: string;
    player_id: string;
    auction_id: string;
    plays_limit: number;
    total_bot_bid: number;
    is_active: boolean;
    player_bot_id: string | undefined;
}
export interface IBidBotInfoCopy {
    auction_id: string;
    player_id: string;
    remaining_seconds: number;
    player_name: string;
    plays_limit: number;
    profile_image: string;
    player_bot_id?: string | undefined;
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