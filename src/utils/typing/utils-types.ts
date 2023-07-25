export interface Imail {
    email: string[];
    template: string;
    subject: string;
    otp?: string;
    user_name?: string;
    message?: string;
}
export enum AUCTION_STATE {
    upcoming="upcoming",
    live="live",
    completed="completed",
    cancelled="cancelled"
}

export enum PRE_REGISTER_THRESHOLD_STATUS {
   completed="completed",
   not_completed="not_completed"
}