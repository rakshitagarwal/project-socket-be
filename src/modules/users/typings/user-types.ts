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
}
export interface IuserPaginationQuery {
    limit: number;
    page: number;
    filter?: Array<object>;
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
    created_by: Date;
    player_name: string;
    profile_image: string;
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
    LAST_PLAYS = "LAST_PLAYS",
}

export type IMultipleUsers = IupdateUser & {
    avatar: string;
    email: string;
    country: string;
    role_id: string;
    referral_code: string;
};

export type ICountry = z.infer<typeof locationSchemas.countries>;
