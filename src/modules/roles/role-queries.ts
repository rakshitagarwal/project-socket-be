import { db } from "../../config/db"
import { IroleQuery, IrolePagination } from "./typings/role-types"
const fetchRole = async (query: IroleQuery) => {
    const user = db.masterRole.findFirst({ where: query })
    return user
}
const fetchAllRoles = async (query: IrolePagination) => {
    const count = await db.masterRole.count({})
    const user = await db.masterRole.findMany({
        where:
            { title: { contains: query.search, mode: 'insensitive' } }
        ,
        take: query.limit as number, skip: (query.page as number) * (query.limit as number),
    })
    return { count, user }
}
const userQueries = {
    fetchRole,
    fetchAllRoles
}
export default userQueries