export interface IAuctionCategory {
    title: string;
}

export interface IPutAuctionCategory {
    title: string;
    status: boolean;
}

export interface IDeleteIds {
    ids: [string];
}
