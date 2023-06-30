import { db } from "../../config/db"
import { IuserQuery, IupdateUser, IuserPaginationQuery } from "./typings/user-types"


/**
 * @description - this query is fetch specific user information
 * @param query - query contains id or email information
 * @returns 
 */
const fetchUser = async (query: IuserQuery) => {
    const user = await db.user.findFirst({
        where: { ...query, is_deleted: false, },
        select: {
            email: true,
            password: true,
            first_name: true,
            last_name: true,
            country: true,
            mobile_no: true,
            id: true,
            roles: {
                select: {
                    id: true,
                    title: true,
                }
            }

        },
    })
    return user
}

/**
 * @description this function is used to update user information
 * @param query - contains unique user information
 * @param payload - update user information
 * @returns 
 */
const updateUser = async (query: IuserQuery, payload: IupdateUser) => {
    const user = await db.user.update({ where: {...query}, data: payload })
    return user
}

/**
 * @description - fetch all users information
 * @param query - this query contains search user information and limit of the user
 * @returns 
 */
const fetchAllUsers = async (query: IuserPaginationQuery) => {
    const user = await db.user.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter },
                {
                    roles: {
                        title: "Player"
                    }
                }
            ],

        },
        take: query.limit,
        skip: query.page * query.limit,
        select: {
            email: true,
            id: true,
            last_name: true,
            first_name: true,
            country: true,
            mobile_no: true,
            roles: {
                select: {
                    id: true,
                    title: true,
                },
            }
        }
    })
    const count = await db.user.count({
        where: {
            is_deleted: false, 
            roles: {
                title: "Player"
            }
        }
    })
    return { user, count }
}

const userQueries = {
    fetchUser,
    updateUser,
    fetchAllUsers
}
export default userQueries