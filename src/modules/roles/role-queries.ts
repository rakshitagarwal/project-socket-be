import { db } from "../../config/db"
import { IroleQuery, IrolePaginationQuery } from "./typings/role-types"
const fetchRole = async (query: IroleQuery) => {
    const user = db.masterRole.findFirst({ where: query })
    return user
}
const fetchAllRoles = async (query: IrolePaginationQuery) => {
    const count = await db.masterRole.count({})
    const user = await db.masterRole.findMany({
        where:
            { title: { contains: query.search, mode: 'insensitive' } }
        ,
        take: query.limit, skip: query.page * query.limit,
    })
    return { count, user }
}
const userQueries = {
    fetchRole,
    fetchAllRoles
}
export default userQueries