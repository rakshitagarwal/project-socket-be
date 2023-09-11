export interface IotpQuery {
    user_id: string
    otp: number
    otp_type?: string
}
export interface IotpId {
    user_id: string
    otp_type?: string

}