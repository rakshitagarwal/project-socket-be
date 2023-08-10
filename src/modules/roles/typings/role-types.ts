export interface Irole {
    title: string
    status: boolean
}
export interface IroleQuery {
    title?: string
    id?: string
}
export interface IrolePagination {
    limit: string| number
    page: string| number
    search: string
}
    