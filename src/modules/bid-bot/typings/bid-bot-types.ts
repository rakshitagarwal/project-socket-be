export interface IBidBotInfo {
    player_id: string;
    auction_id: string;
    plays_limit: number;
    total_bot_bid: number;
    is_active: boolean;
}
export interface IBidBotData {
    player_id: string;
    auction_id: string;
    plays_limit: number;
    remaining_seconds: number;
    player_name: string;
    profile_image: string;
    total_bot_bid?: number | undefined;
    is_active?: boolean | undefined;
    player_bot_id?: string | undefined;
    socket_id?: string | undefined;
}

export interface ISearch {
    player_id: string;
    auction_id: string;
    plays_limit: number | undefined;
}
