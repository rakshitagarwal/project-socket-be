import { db } from "../../config/db"
import { IoptQuery, IotpId } from "./typings/user-otp-types"
const findUserOtp = async (query: IoptQuery) => {
    const otp = await db.userOTP.findFirst({ where: query })
    return otp
}
const deleteOtp = async (query: IotpId) => {
    const otp = await db.userOTP.delete({ where: query })
    return otp
}

const otpQuery = {
    findUserOtp,
    deleteOtp,
}
export default otpQuery