export type addReqBody = {
    id: string;
    title: string;
    description: string;
    product_category_id: string;
    landing_image: string;
    userId: string;
};
export type updateReqBody = {
    id: string;
    title: string;
    description: string;
    product_category_id: string;
    landing_image: string;
    userId: string;
};

export interface IPagination {
    page: string;
    limit: string;
    search?: string;
}

export interface IPaginationQuery {
    page: number;
    limit: number;
    filter: Array<Object>
}
export interface Ids {
    ids: Array<string>
}
export interface Iid {
    id: string;
}

export interface IgetRequest {
    query: IPagination,
    params: Iid
}