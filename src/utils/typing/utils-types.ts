export interface Imail {
    email: string;
    template: string;
    subject: string;
    otp?: string;
    user_name: string;
}

export enum AUCTION_STATE {
    upcoming="upcoming",
    live="live",
    completed="completed",
    cancelled="cancelled"
}
