export interface Iuser {
    first_name: string
    last_name: string
    email: string
    country: string
    mobile_no: string
    role_id: string
    status: boolean
    password: string
}
export interface IuserQuery {
    email?: string
    id?: string
}