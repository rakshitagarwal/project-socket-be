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
    pageNum: number;
    recordLimit: number;
}
export interface Ids {
    ids: Array<string>
}