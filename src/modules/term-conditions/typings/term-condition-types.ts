export interface Iupdate {
    title?: string;
    content?: string;
    status?: boolean;
    is_deleted?: boolean;
}
export interface Icreate{
    title: string;
    content: string;
    created_by: string;
}

export interface Iid{
    id?: string;
}