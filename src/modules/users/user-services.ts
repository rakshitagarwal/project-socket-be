import { Iuser } from "./typings/user-types"
import userQueries from "./user-queries"
import { responseBuilder } from "../../common/responses"
import { PrismaClient } from '@prisma/client'
import { prismaTransaction } from "../../utils/prisma-transactions"
import eventService from "../../utils/event-service"
import { TEMPLATE, MESSAGES } from "../../common/constants"
import roleQueries from "../roles/role-queries"

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
        const user = await prisma.user.create({ data: body })
        const passcode = Math.round(Math.random() * 10000).toString().padStart(4, "0");
        eventService.emit('send-user-mail', { email: user.email, otp: passcode, user_name: `${user.first_name} ${user.last_name}`, subject: "Email verification", template: TEMPLATE.EMAIL_VERIFICATION })
    })
    return responseBuilder.createdSuccess(MESSAGES.USERS.CHECK_MAIL)
}

const userService = {
    register
}

export default userService