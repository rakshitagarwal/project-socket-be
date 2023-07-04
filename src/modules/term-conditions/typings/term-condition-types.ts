export interface Iupdate {
    title?: string;
    content?: string;
    status?: boolean;
    is_deleted?: boolean;
}
export interface Icreate {
    title: string;
    content: string;
    created_by: string;
}

export interface Iid {
    id?: string;
}

export interface Ipagination {
    limit: number
    page: number
    search: string
}

export interface IpaginationQuery {
    limit: number
    page: number
    filter: Array<Object>
}