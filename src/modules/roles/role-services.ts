import { responseBuilder } from "../../common/responses"
import { PrismaClient } from '@prisma/client'
import { prismaTransaction } from "../../utils/prisma-transactions"
import { Irole, IroleQuery, IrolePagination } from "./typings/role-types"
import roleQueries from "./role-queries"
import { MESSAGES } from "../../common/constants"
const fetchRole = async (payload: IroleQuery) => {
    const role = await roleQueries.fetchRole({ title: payload.title })
    if (!role) {
        return responseBuilder.notFoundError()
    }
    return responseBuilder.okSuccess(MESSAGES.ROLE.FOUND_ROLE, role)
}

const AddNewRole = async (body: Irole) => {
    const isRole = await roleQueries.fetchRole({ title: body.title })
    if (isRole) {
        return responseBuilder.conflictError(MESSAGES.ROLE.ROLE_EXIST)
    }
    return await prismaTransaction(async (prisma: PrismaClient) => {
        await prisma.masterRole.create({ data: body })
        return responseBuilder.createdSuccess(MESSAGES.ROLE.ROLE_ADDED)
    })
}
const fetchAllRoles = async (query: IrolePagination) => {
    const page = parseInt(query.page) || 0
    const limit = parseInt(query.limit) || 10
    const result = await roleQueries.fetchAllRoles({ page, limit, search: query.search || '' })
    return responseBuilder.okSuccess(MESSAGES.ROLE.FOUND_ROLE, result.user, { limit, page, totalRecord: result.count, totalPage: Math.ceil(result.count / limit) })
}

const roleService = {
    fetchRole,
    AddNewRole,
    fetchAllRoles
}
export default roleService