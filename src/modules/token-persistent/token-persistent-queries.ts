import { db } from "../../config/db"
import { ItokenPersister,ItokenQuery } from "./typings/token-persistent-types"
const createTokenPersistence = async (body: ItokenPersister)=>{
    const token = await db.userPersistent.create({data:body})
    return token
}

const findPersistentToken = async (query: ItokenQuery)=>{
    const token = await db.userPersistent.findFirst({where:query})
    return token
}
const deletePersistentToken = async (query: ItokenQuery)=>{
    const token = await db.userPersistent.deleteMany({where:query})
    return token
}
const tokenPersistanceQuery={
    createTokenPersistence,
    findPersistentToken,
    deletePersistentToken
}
export default tokenPersistanceQuery