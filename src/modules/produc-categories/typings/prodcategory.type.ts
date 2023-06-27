export type addReqBody = {
    id: string;
    title: string;
};

interface IProductCategory {
    id?: string;
    title?: string;
    is_deleted: boolean;
    status: boolean;
    created_by?: string;
    updated_by?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class ProductCategory implements IProductCategory {
    id?: string;
    title!: string;
    is_deleted = false;
    status = true;
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
