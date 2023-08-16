export interface IBidBotData {
    player_bot_id?: string;
    player_id: string;
    auction_id: string;
    plays_limit: number;
    price_limit?: number;
    total_bot_bid: number;
    is_active?: boolean;
    player_name?: string;
    profile_image?: string;
    // remaining_seconds?: number;
    socket_id?: string;
    plays?: number;
}

export interface IFindBidBot {
    player_id: string;
    auction_id: string;
    plays_limit: number | undefined;
}