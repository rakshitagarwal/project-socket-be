export type addReqBody = {
    id: string;
    title: string;
};
export type updateReqBody = {
    title: string;
};
export interface IParamQuery {
    id?: string
}

export interface Ids {
    ids: Array<string>
}

