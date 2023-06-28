import { db } from "../../config/db"
import { IuserQuery, IupdateUser } from "./typings/user-types"

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
            role_id: true,
            is_verified:true
        }
    })
    return user
}
const updateUser = async (query: IuserQuery, payload: IupdateUser) => {
    const user = await db.user.update({ where: query, data: payload })
    return user
}
const userQueries = {
    fetchUser,
    updateUser
}
export default userQueries