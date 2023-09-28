import { z } from "zod";
import userSchemas from "../user-schemas";
import { locationSchemas } from "../../location/location-schema";

export interface Iuser {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    mobile_no: string;
    role: string;
    status: boolean;
    password?: string;
    referral_code: string;
    applied_referral?: string;
}

export interface IuserQuery {
    email?: string;
    id?: string;
}
export interface Ilogin {
    email: string;
    password: string;
    ip_address: string;
    user_agent: string;
}
export interface IplayerLogin {
    email: string;
}

export interface IupdateUser {
    first_name?: string;
    last_name?: string;
    country?: string;
    mobile_no?: string;
    status?: boolean;
    is_verified?: boolean;
    is_deleted?: boolean;
    password?: string;
}

export interface IotpVerification {
    otp: string;
    email: string;
    otp_type: string;
    ip_address: string;
    user_agent: string;
}

export interface ItokenQuery {
    access_token?: string;
}

export interface IrefreshToken {
    refresh_token: string;
    ip_address: string;
    user_agent: string;
}

export interface IupdatePassword {
    email: string;
    otp: string;
    newPassword: string;
}

export interface IresetPassword {
    oldPassword: string;
    newPassword: string;
    email: string;
}
export interface IuserPagination {
    limit: string;
    page: string;
    search?: string;
    _sort?: string;
    _order?: string;
}
export interface IuserPaginationQuery {
    limit: number;
    page: number;
    _sort?: string;
    _order?: string;
    search?: string;
    filter: Array<object>;
}

export type IWalletTx = z.infer<typeof userSchemas.ZPlayerBalance>;
export type IDeductPlx = z.infer<typeof userSchemas.ZDeductPlays>;
export interface ILastPlayTrx {
    auction_id: string;
    player_id: string;
    plays: number;
    spends_on: Ispend_on;
}

export interface IPlayerBidLog {
    player_id: string;
    auction_id: string;
    bid_number: number;
    bid_price: number;
    remaining_seconds: number;
    player_bot_id?: string;
    created_at: Date;
    player_name: string;
    profile_image: string;
}

export interface IminAuctionBidLog {
    is_unique: boolean;
    is_lowest?: boolean;
    is_highest?: boolean;
    created_at: Date;
    player_name: string;
    profile_image: string;
    player_id: string;
    auction_id: string;
    bid_price: number;
}
export interface IPlayerActionWinner {
    player_id: string;
    auction_id: string;
    player_bot_id?: string;
    total_bids: number;
}

export type PlayerBidLogGroup = {
    player_id: string;
    player_name: string;
    auction_id: string;
    profile_image: string;
    count: number;
    play_balance: number;
    credit_sum?: number;
};

export enum Ispend_on {
    BUY_PLAYS = "BUY_PLAYS",
    REFUND_PLAYS = "REFUND_PLAYS",
    BID_PLAYS = "BID_PLAYS",
    REFERRAL_PLAYS = "REFERRAL_PLAYS",
    AUCTION_REGISTER_PLAYS = "AUCTION_REGISTER_PLAYS",
    EXTRA_BIGPLAYS = "EXTRA_BIGPLAYS",
    JOINING_BONUS = "JOINING_BONUS",
    TRANSFER_PLAYS = "TRANSFER_PLAYS",
    RECEIVED_PLAYS = "RECEIVED_PLAYS",
}

export type IMultipleUsers = IupdateUser & {
    avatar: string;
    email: string;
    country: string;
    role_id: string;
    referral_code: string;
};

export interface IGetAllUsers {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    country: string;
    avatar: string;
    mobile_no: string;
    Plays_In_Wallet: number;
    Auction_Won: number;
    Player_Participated: number;
}
export type ICountry = z.infer<typeof locationSchemas.countries>;
