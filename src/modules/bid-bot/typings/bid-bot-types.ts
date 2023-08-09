export interface IBidBotData {
    player_id: string;
    auction_id: string;
    total_bot_bid: number;
    plays_limit: number;
    is_active?: boolean;
    player_name?: string;
    profile_image?: string;
    remaining_seconds?: number;
    player_bot_id?: string;
    socket_id?: string;
}

export interface IFindBidBot {
    player_id: string;
    auction_id: string;
    plays_limit: number | undefined;
}