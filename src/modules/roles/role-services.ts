import { responseBuilder } from "../../common/responses"
import { PrismaClient } from '@prisma/client'
import { prismaTransaction } from "../../utils/prisma-transactions"
import { Irole, IroleQuery, IrolePagination } from "./typings/role-types"
import roleQueries from "./role-queries"
import { MESSAGES } from "../../common/constants"

/**
 * @description - fetch specific role with title
 * @param payload - this payload  contains the role title object
 * @returns {Promise}
 */
const fetchRole = async (payload: IroleQuery) => {
    const role = await roleQueries.fetchRole({ title: payload.title })
    if (!role) {
        return responseBuilder.notFoundError()
    }
    return responseBuilder.okSuccess(MESSAGES.ROLE.FOUND_ROLE, role)
}

/**
 * @description - Add new role information to the database
 * @param body - contains req.body data for role information
 * @returns {Promise}
 */

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
/**
 * @description - this function is use for fetching the role list information in the database
 * @param body - contains pagination information or search 
 * @returns {Promise}
 */
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