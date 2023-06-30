import { Iuser, IotpVerification, Ilogin, IplayerLogin, ItokenQuery, IuserQuery, IupdateUser, IrefreshToken, IupdatePassword, IresetPassword, IuserPagination } from "./typings/user-types"
import userQueries from "./user-queries"
import bcrypt from "bcrypt"
import { responseBuilder } from "../../common/responses"
import { PrismaClient } from '@prisma/client'
import { prismaTransaction } from "../../utils/prisma-transactions"
import eventService from "../../utils/event-service"
import { TEMPLATE, MESSAGES, OTP_TYPE } from "../../common/constants"
import roleQueries from "../roles/role-queries"
import otpQuery from "../user-otp/user-otp-queries"
import { generateAccessToken } from "../../common/helper"
import tokenPersistanceQuery from "../token-persistent/token-persistent-queries"
import { hashPassword } from "../../common/helper"
/**
 * @description register user into databse
 * @param body - admin or player registration's request body
 */

const register = async (body: Iuser) => {
    const { role, ...payload } = body
    const isRole = await roleQueries.fetchRole({ title: role })
    if ((isRole?.title)?.toLocaleLowerCase() == "admin") {
        return responseBuilder.conflictError(MESSAGES.USERS.ADMIN_EXIST)
    }
    if (!isRole) {
        return responseBuilder.notFoundError(MESSAGES.ROLE.ROlE_NOT_EXIST)
    }
    const isUser = await userQueries.fetchUser({ email: payload.email })
    if (isUser) {
        return responseBuilder.conflictError(MESSAGES.USERS.USER_EXIST)
    }
    await prismaTransaction(async (prisma: PrismaClient) => {
        const user = await prisma.user.create({ data: { ...payload, role_id: isRole.id } })
        eventService.emit('send-user-mail', { email: user.email, user_name: `${user.first_name} ${user.last_name}`, subject: "Welcome to Big Deal", template: TEMPLATE.EMAIL_VERIFICATION })
    })
    return responseBuilder.createdSuccess(MESSAGES.USERS.SIGNUP)
}

/**
 * @description verfify the email address or login player with verification
 * @param body user's request object
 */

const otpVerifcation = async (body: IotpVerification) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isOtp = await otpQuery.findUserOtp({ otp: Number(body.otp), user_id: isUser.id })
    if (!isOtp || isOtp.otp_type !== OTP_TYPE.LOGIN_TYPE) {
        return responseBuilder.badRequestError(MESSAGES.OTP.INVALID_OTP)
    }
    const tokenInfo = generateAccessToken({ id: isUser.id })
    await otpQuery.deleteOtp({ id: isOtp.id })
    await tokenPersistanceQuery.createTokenPersistence({ ...tokenInfo, user_agent: body.user_agent, user_id: isUser.id, ip_address: body.ip_address })
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGIN, { ...isUser, accessToken: tokenInfo.access_token, refreshToken: tokenInfo.refresh_token })

}
/**
 * @description login admin 
 * @param body user's request object
 */

const adminLogin = async (body: Ilogin) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isPassword = bcrypt.compareSync(body.password, isUser?.password as string)
    if (!isPassword) {
        return responseBuilder.notFoundError(MESSAGES.USERS.INVALID_CREDENTIAL)
    }
    delete (isUser as Partial<Pick<Iuser, "password">>).password;
    const tokenInfo = generateAccessToken({ id: isUser.id })
    await tokenPersistanceQuery.createTokenPersistence({ ...tokenInfo, user_agent: body.user_agent, user_id: isUser.id, ip_address: body.ip_address })
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGIN, { ...isUser, accessToken: tokenInfo.access_token, refreshToken: tokenInfo.refresh_token })
}

/**
 * @description login playes and sent mail on current user
 * @param body user's request object
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
    return responseBuilder.okSuccess(MESSAGES.USERS.CHECK_MAIL)
}

/**
 * @description - user logout for user.
 * @param body - user access token
 */
const logout = async (body: ItokenQuery) => {
    const istoken = await tokenPersistanceQuery.deletePersistentToken({ access_token: body.access_token })
    if (!istoken) {
        return responseBuilder.notFoundError()
    }
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_LOGOUT)
}


/**
 * @description fetch user into database
 * @param param - param containing user id
 */
const getUser = async (param: IuserQuery) => {
    const user = await userQueries.fetchUser({ id: param.id })
    if (!user) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    delete (user as Partial<Pick<Iuser, "password">>).password;
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_FOUND, user)
}

/**
 * @param parmas -param containing user id
 * @param body - user's request body
 * @description update user into databse
 */

const updateUser = async (parmas: IuserQuery, body: IupdateUser) => {
    const user = await userQueries.updateUser({ id: parmas.id }, body);
    if (!user) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    return responseBuilder.okSuccess(MESSAGES.USERS.UPDATE_USER)
}

/**
 * @description fetch the access token with refresh token
 * @param body - body contain req access token information
 */
const refreshToken = async (body: IrefreshToken) => {
    const isToken = await tokenPersistanceQuery.findPersistentToken({ refresh_token: body.refresh_token })
    if (!isToken) {
        return responseBuilder.notFoundError(MESSAGES.JWT.TOKEN_NOT_FOUND)
    }
    const tokenInfo = generateAccessToken({ id: isToken.user_id })
    await tokenPersistanceQuery.deletePersistentToken({ refresh_token: body.refresh_token })
    await tokenPersistanceQuery.createTokenPersistence({ ...tokenInfo, user_agent: body.user_agent, user_id: isToken.user_id, ip_address: body.ip_address })
    return responseBuilder.okSuccess(MESSAGES.JWT.DATA_FOUND, { accessToken: tokenInfo.access_token, refreshToken: tokenInfo.refresh_token })
}


/**
 * @description delete user into database
 * @param param - param containing user id
 */
const deleteUser = async (param: IuserQuery) => {
    const user = await userQueries.fetchUser({ id: param.id })
    if (!user) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isupdate = await userQueries.updateUser({ id: param.id }, { is_deleted: true })
    if (isupdate.is_deleted) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_DELETED)
}

/**
 * @description - this service is used to sent otp mail for forget password
 * @param body - this body contains the player email
 * @returns 
 */
const forgetPassword = async (body: IplayerLogin) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    await prismaTransaction(async (prisma: PrismaClient) => {
        const passcode = Math.round(Math.random() * 10000).toString().padStart(4, "0");
        await prisma.userOTP.create({ data: { user_id: isUser.id, otp: Number(passcode), otp_type: OTP_TYPE.FORGET_PASSWORD } })
        eventService.emit('send-user-mail', { email: isUser.email, otp: passcode, user_name: `${isUser.first_name} ${isUser.last_name}`, subject: "Forget password", template: TEMPLATE.FORGET_PASSWORD })
    })
    return responseBuilder.createdSuccess(MESSAGES.USERS.CHECK_MAIL)
}

/**
 * @description - this service is used to update a user's password
 * @param body - this body contains the email otp and newPassword
 * @returns 
 */
const updatePassword = async (body: IupdatePassword) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isOtp = await otpQuery.findUserOtp({ otp: Number(body.otp), user_id: isUser.id })
    if (!isOtp) {
        return responseBuilder.badRequestError(MESSAGES.OTP.INVALID_OTP)
    }
    const password = hashPassword(body.newPassword)
    await userQueries.updateUser({ id: isUser.id }, { password: password })
    return responseBuilder.okSuccess(MESSAGES.USERS.PASSWORD_UPDATED)
}
/**
 * @description - this service is used for reset user password
 * @param body - this body contains the old password  new password and email address
 * @returns 
 */
const resetPassword = async (body: IresetPassword) => {
    const isUser = await userQueries.fetchUser({ email: body.email })
    if (!isUser) {
        return responseBuilder.notFoundError(MESSAGES.USERS.USER_NOT_FOUND)
    }
    const isPassword = bcrypt.compareSync(body.oldPassword, isUser?.password as string)
    if (!isPassword) {
        return responseBuilder.badRequestError(MESSAGES.USERS.WORNG_PASSWORD)
    }
    const password = hashPassword(body.newPassword)
    await userQueries.updateUser({ id: isUser.id }, { password })
    return responseBuilder.okSuccess(MESSAGES.USERS.PASSWORD_UPDATED)
}
/**
 * @description This API fetch all player records
 * @param {object} query  - query contain the page limit and search fields
 */
const fetchAllUsers = async (query: IuserPagination) => {
    const filter = []
    const page = parseInt(query.page) || 0
    const limit = parseInt(query.limit) || 10
    if (query.search) {
        filter.push(
            { first_name: { contains: query.search, mode: 'insensitive' } },
            { last_name: { contains: query.search, mode: 'insensitive' } },
            { country: { contains: query.search, mode: 'insensitive' } }
        )
    }
    const result = await userQueries.fetchAllUsers({ page, limit, filter })
    return responseBuilder.okSuccess(MESSAGES.USERS.USER_FOUND, result.user, { limit, page, totalRecord: result.count, totalPage: Math.ceil(result.count / limit), search: query.search })
}

const userService = {
    register,
    otpVerifcation,
    adminLogin,
    playerLogin,
    logout,
    getUser,
    updateUser,
    refreshToken,
    deleteUser,
    forgetPassword,
    updatePassword,
    resetPassword,
    fetchAllUsers
}

export default userService