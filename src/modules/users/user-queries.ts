import { db } from "../../config/db"
import { IuserQuery } from "./typings/user-types"
const fetchUser = async (query: IuserQuery) => {
    const user = db.user.findFirst({ where: query })
    return user
}
const userQueries = {
    fetchUser
}
export default userQueries