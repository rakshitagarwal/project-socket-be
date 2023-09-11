import { db } from "../../config/db";
import { IotpQuery, IotpId } from "./typings/user-otp-types";
const findUserOtp = async (query: IotpQuery) => {
    const otp = await db.userOTP.findFirst({ where: query });
    return otp;
};
const deleteOtp = async (query: IotpId) => {
    const otp = await db.userOTP.deleteMany({ where: query });
    return otp;
};

/**
 * Creates an OTP (One-Time Password) record in the database.
 * @param {Object} body - The request body containing user_id, otp, and otp_type.
 * @param {number} body.user_id - The ID of the user associated with the OTP.
 * @param {number} body.otp - The OTP value.
 * @param {string} body.otp_type - The type of OTP (e.g., "email_verification" or "login_passcode").
 * @returns {Promise<IotpQuery>} A Promise that resolves with the created OTP record.
 */
const createOtp = async (body: IotpQuery & {otp_type:string}) => {
    const otp = await db.userOTP.create({ data: {
        user_id: body.user_id,
        otp: body.otp,
        otp_type: body.otp_type
    } });
    return otp;
};

const otpQuery = {
    findUserOtp,
    deleteOtp,
    createOtp
};
export default otpQuery;
