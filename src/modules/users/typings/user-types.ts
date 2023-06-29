export interface Iuser {
    first_name: string
    last_name: string
    email: string
    country: string
    mobile_no: string
    role: string
    status: boolean
    password?: string
}

export interface IuserQuery {
    email?: string
    id?: string
}
export interface Ilogin {
    email: string
    password: string
    ip_address: string
    user_agent: string
}
export interface IplayerLogin {
    email: string
}

export interface IupdateUser {
    first_name?: string
    last_name?: string
    country?: string
    mobile_no?: string
    status?: boolean
    is_verified?: boolean
    is_deleted?: boolean,
    password?: string
}

export interface IotpVerification {
    otp: string
    email: string
    otp_type: string
    ip_address: string
    user_agent: string
}

export interface ItokenQuery {
    access_token?: string
}

export interface IupdateUser {
    first_name?: string
    last_name?: string
    country?: string
    mobile_id?: string
}

export interface IrefreshToken {
    refresh_token: string
    ip_address: string
    user_agent: string
}

export interface IupdatePassword {
    email: string
    otp: string
    newPassword: string
}

export interface IresetPassword {
    oldPassword: string
    newPassword: string
    email: string
}
export interface IuserPagination {
    limit: string
    page: string
    search?: string
}
export interface IuserPaginationQuery {
    limit: number
    page: number
    filter?: Array<object>
}
