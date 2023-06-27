import { Iuser, IotpVerification, Ilogin, IplayerLogin, ItokenQuery } from "./typings/user-types"
import userQueries from "./user-queries"
import bcrypt from "bcrypt"
import { responseBuilder } from "../../common/responses"
import { PrismaClient } from '@prisma/client'
import { prismaTransaction } from "../../utils/prisma-transactions"
import eventService from "../../utils/event-service"
import { TEMPLATE, MESSAGES, OTP_TYPE } from "../../common/constants"
import roleQueries from "../roles/role-queries"
import otpQuery from "../user-otp/user-otp-queries"
import { hashPassword, generateAccessToken } from "../../utils/index"
import tokenPersistanceQuery from "../token-persistent/token-persistent-queries"

/**
 * @param user - admin or player registration's request body
 * @description register user into databse
 */

const register = async (body: Iuser) => {
    const isRole = await roleQueries.fetchRole({ id: body.role_id })
    if ((isRole?.title)?.toLocaleLowerCase() == "admin") {
        return responseBuilder.conflictError(MESSAGES.USERS.ADMIN_EXIST)
    }
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (isUser) {
        return responseBuilder.conflictError(MESSAGES.USERS.USER_EXIST)
    }
    await prismaTransaction(async (prisma: PrismaClient) => {
        if (body.password) {
            body.password = hashPassword(body.password)
        }
        const user = await prisma.user.create({ data: body })
        const passcode = Math.round(Math.random() * 10000).toString().padStart(4, "0");
        await prisma.userOTP.create({ data: { user_id: user.id, otp: Number(passcode), otp_type: OTP_TYPE.EMAIL_VERIFICATION } })
        eventService.emit('send-user-mail', { email: user.email, otp: passcode, user_name: `${user.first_name} ${user.last_name}`, subject: "Email verification", template: TEMPLATE.EMAIL_VERIFICATION })
    })
    return responseBuilder.createdSuccess(MESSAGES.USERS.CHECK_MAIL)
}

/**
 * @description verfify the email address or login player with verification
 * @param user user's request object
 */

const otpVerifcation = async (body: IotpVerification) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isOtp = await otpQuery.findUserOtp({ otp: Number(body.otp), user_id: isUser.id })
    if (!isOtp) {
        return responseBuilder.badRequestError(MESSAGES.OTP.INVALID_OTP)
    }
    if (isOtp.otp_type == OTP_TYPE.LOGIN_TYPE) {
        if (!isUser.is_verified) {
            return responseBuilder.badRequestError(MESSAGES.USERS.VERIFICATION_ERROR)
        }
        const accessToken = generateAccessToken({ id: isUser.id })
        await otpQuery.deleteOtp({ id: isOtp.id })
        delete (isUser as Partial<Pick<Iuser, "password">>).password;
        await tokenPersistanceQuery.createTokenPersistence({ ...accessToken, user_agent: body.user_agent, user_id: isUser.id, ip_address: body.ip_address })
        return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGIN, { ...isUser, accessToken: accessToken.access_token, refreshToken: accessToken.refresh_token })
    } else {
        await otpQuery.deleteOtp({ id: isOtp.id })
        await userQueries.updateUser({ id: isUser.id }, { is_verified: true })
        return responseBuilder.okSuccess(MESSAGES.USERS.USER_VERIFIED)
    }
}
/**
 * @description login admin 
 * @param user user's request object
 */

const adminLogin = async (body: Ilogin) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isPassword = bcrypt.compareSync(body.password, isUser.password)
    if (!isPassword) {
        return responseBuilder.notFoundError(MESSAGES.USERS.INVALID_CREDENTIAL)
    }
    delete (isUser as Partial<Pick<Iuser, "password">>).password;
    const accessToken = generateAccessToken({ id: isUser.id })
    await tokenPersistanceQuery.createTokenPersistence({ ...accessToken, user_agent: body.user_agent, user_id: isUser.id, ip_address: body.ip_address })
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGIN, { ...isUser, accessToken: accessToken.access_token, refreshToken: accessToken.refresh_token })
}

/**
 * @description login playes and sent mail on current user
 * @param user user's request object
 */

const playerLogin = async (body: IplayerLogin) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    await prismaTransaction(async (prisma: PrismaClient) => {
        const passcode = Math.round(Math.random() * 10000).toString().padStart(4, "0");
        await prisma.userOTP.create({ data: { user_id: isUser.id, otp: Number(passcode), otp_type: OTP_TYPE.LOGIN_TYPE } })
        eventService.emit('send-user-mail', { email: isUser.email, otp: passcode, user_name: `${isUser.first_name} ${isUser.last_name}`, subject: "Login Passcode", template: TEMPLATE.LOGIN_OTP })
    })
    return responseBuilder.createdSuccess(MESSAGES.USERS.CHECK_MAIL)
}
/**.
 * @description - user logout for user.
 * @param - user access token
 */
const logout = async (body: ItokenQuery) => {
    const istoken = await tokenPersistanceQuery.deletePersistentToken({ access_token:body.access_token})
    console.log(istoken)
    if(!istoken){
        return responseBuilder.notFoundError()
    }
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGOUT)
}

const userService = {
    register,
    otpVerifcation,
    adminLogin,
    playerLogin,
    logout
}

export default userService