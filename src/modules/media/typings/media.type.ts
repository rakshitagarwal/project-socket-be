export interface IFileMetaInfo {
    filename?: string;
    size?: number;
    type?: string;
    local_path?: string;
    path?: string;
    tag?: string;
    mime_type?: string;
    created_by?: string;
    mimetype?: string;
}

export interface Iid {
    ids: string[];
}

export interface IMediaQuery {
    id:string;
    filename:string,
    size: number,
    type:string,
    local_path:  string,
    tag: string,
    mime_type: string,
    created_by: string
}