export type addReqBody = {
    id: string;
    title: string;
    description: string;
    product_category_id: string;
    userId: string;
};

interface IProduct {
    id?: string;
    title?: string;
    description: string;
    is_deleted: boolean;
    status: boolean;
    product_category_id?: string;
    created_by?: string;
    updated_by?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPagination {
    pageNum: number;
    recordLimit: number;
}

export class Product implements IProduct {
    id?: string;
    title!: string;
    description!: string;
    is_deleted = false;
    status = true;
    product_category_id!: string;
    created_by!: string;
    updated_by!: string;
    created_at?: Date;
    updated_at?: Date;
    changeDetails: { [key: string]: string } = {};

    setUpdate(updateInfo: { [key: string]: string }) {
        // this.updated_by = updatedBy;
        const { id, ...rest } = updateInfo;
        this.changeDetails = rest;
        this.id = id ? id : '';
        return this;
    }
}
