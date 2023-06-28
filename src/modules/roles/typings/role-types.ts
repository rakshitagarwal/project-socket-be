export interface Irole {
    title: string
    status: boolean
}
export interface IroleQuery {
    title?: string
    id?: string
}
export interface IrolePagination {
    limit: string
    page: string
    search: string
}
export interface IrolePaginationQuery {
    limit: number
    page: number
    search: string
}