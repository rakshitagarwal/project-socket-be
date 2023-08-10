import { db } from "../../config/db"
import { Iupdate, Iid, Icreate, IpaginationQuery } from "./typings/term-condition-types"

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

const findOne = async (query: Iid) => {
    const termCondition = await db.termsAndConditions.findFirst({
        where: { ...query, is_deleted: false }, select: {
            id: true,
            content: true,
            status: true,
            updated_at: true
        }
    })
    return termCondition
}

/**
 * @description update the specifice term condition information
 * @param query - contains the indenfication of term condition
 * @param body - contains the body data
 * @returns 
 */

const update = async (query: Iid, body: Iupdate) => {
    const termCondition = await db.termsAndConditions.update({ where: query, data: body, })
    return termCondition
}
/**
 * @description fetch all  term condition information
 * @returns 
 */
const findAll = async (query: IpaginationQuery) => {
    const termCondition = await db.termsAndConditions.findMany({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter }
            ],

        },
        take: query.limit,
        skip: query.page * query.limit,
        orderBy:{
            updated_at:"desc"
        },
        select: {
            id: true,
            content: true,
            updated_at: true,
        }
    })
    const count = await db.termsAndConditions.count({
        where: {
            AND: [
                {
                    is_deleted: false,
                },
                { OR: query.filter }
            ],
        }
    })
    return { termCondition, count }
}
const findTermAndCondition = async () => {
    const termCondition = await db.termsAndConditions.findFirst({
        select: {
            id: true,
            content: true,
            updated_at: true,
        }
    })
    return termCondition
}
const termAndConditionQuery = {
    update,
    create,
    findOne,
    findAll,
    findTermAndCondition
}
export default termAndConditionQuery