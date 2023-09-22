export type addReqBody = {
    id: string;
    title: string;
    description: string;
    price: number,
    product_category_id: string;
    landing_image: string;
    userId: string;
    media_id: Array<string>

};
export type updateReqBody = addReqBody

export interface IPagination {
    page: string;
    limit: string;
    search?: string;
    orderBy?: string;
}

export interface IPaginationQuery {
    page: number;
    limit: number;
    orderBy?: string;
    filter: Array<object>
}
export interface Ids {
    ids: Array<string>
}

export interface IProductMedia {
    media_id: string,
    product_id: string
}
export interface Iid {
    id?: string;
}

