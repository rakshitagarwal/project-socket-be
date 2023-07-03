import { db } from "../../config/db"
import { Iupdate, Iid, Icreate } from "./typings/term-condition-types"

/**
 * @description create a new term & condition
 * @param body - body object
 * @returns 
 */
const create = async (body: Icreate) => {
    const termCondition = await db.termsAndConditions.create({ data: body })
    return termCondition
}

/**
 * @description fetch the specifice term condition information
 * @param query - contains the indenfication of term condition
 * @returns 
 */

const findOne=async(query:Iid)=>{
    const termCondition = await db.termsAndConditions.findFirst({ where:query })
    return termCondition
}

/**
 * @description update the specifice term condition information
 * @param query - contains the indenfication of term condition
 * @param body - contains the body data
 * @returns 
 */

const update = async (query: Iid, body: Iupdate) => {
    const termCondition = await db.termsAndConditions.update({ where: query, data: body })
    return termCondition
}

const termAndConditionQuery = {
    update,
    create,
    findOne
}
export default termAndConditionQuery