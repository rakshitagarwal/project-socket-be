export type addReqBody = {
    id: string;
    title: string;
    description: string;
    product_category_id: string;
    landing_image: string;
    userId: string;
    media_id: Array<string>

};
export type updateReqBody = {
    id: string;
    title: string;
    description: string;
    product_category_id: string;
    landing_image: string;
    userId: string;
    media_id: Array<string>
};

export interface IPagination {
    page: string;
    limit: string;
    search?: string;
}

export interface IPaginationQuery {
    page: number;
    limit: number;
    filter: Array<object>
}
export interface Ids {
    ids: Array<string>
}

export type IProductMedia = {
    media_id: string,
    product_id: string
}[];
export interface Iid {
    id: string;
}
