import termAndConditionQuery from "./term-condition-queries"
import { Icreate, Iupdate, Iid, Ipagination } from "./typings/term-condition-types"
import { responseBuilder } from "../../common/responses"
import { MESSAGES } from "../../common/constants"



/**
 * @description - Add new term and condition 
 * @param body - contains req.body data for term and conditions
 * @returns {Promise}
 */

const create = async (body: Icreate) => {
    const isTermAndCondition = await termAndConditionQuery.findTermAndCondition()
    if(isTermAndCondition){
        return responseBuilder.conflictError(MESSAGES.TERM_CONDITION.CONFLICT)
    }
    const result = await termAndConditionQuery.create(body)
    if (!result) {
        return responseBuilder.expectationField()
    }
    return responseBuilder.createdSuccess(MESSAGES.TERM_CONDITION.CREATED)
}

/**
 * @description - update the term and condition information 
 * @param {string} id - contains the unique identification
 * @param body - contains req.body data for term and conditions
 * @returns {Promise}
 */

const update = async (id: Iid, body: Iupdate) => {
    const isTermAndCondition = await termAndConditionQuery.findOne(id)
    if (!isTermAndCondition) {
        return responseBuilder.notFoundError(MESSAGES.TERM_CONDITION.NOT_FOUND)
    }
    if (!isTermAndCondition.status) {
        return responseBuilder.badRequestError(MESSAGES.TERM_CONDITION.INACTIVE_STATUS)
    }
    const result = await termAndConditionQuery.update(id, body)
    if (!result) {
        return responseBuilder.expectationField()
    }
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.UPDATED)
}

/**
 * @description - fetch the term and condition information 
 * @param {string} id - contains the unique identification
 * @returns {Promise}
 */
const fetchOne = async (id: Iid) => {
    const isTermAndCondition = await termAndConditionQuery.findOne(id)
    if (!isTermAndCondition) {
        return responseBuilder.notFoundError(MESSAGES.TERM_CONDITION.NOT_FOUND)
    }
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.FOUNDED, isTermAndCondition)
}

/**
 * @description - delete the term and condition information 
 * @param {string} id - contains the unique identification
 * @returns {Promise}
 */
const deleteOne = async (id: Iid) => {
    const isTermAndCondition = await termAndConditionQuery.findOne(id)
    if (!isTermAndCondition) {
        return responseBuilder.notFoundError(MESSAGES.TERM_CONDITION.NOT_FOUND)
    }
    await termAndConditionQuery.update(id, { is_deleted: true })
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.DELETED)
}

/**
 * @description This API fetch all T&C records
 * @param {object} query  - query contain the page limit and search fields
 */
const findTermAndCondition = async () => {
    const result = await termAndConditionQuery.findTermAndCondition()
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.FOUNDED, result as object)
}

const fetchAll = async (query: Ipagination) => {
    const filter = []
    const page = parseInt(query.page) || 0
    const limit = parseInt(query.limit) || 10
    if (query.search) {
        filter.push(
            { title: { contains: query.search, mode: 'insensitive' } },
        )
    }
    const result = await termAndConditionQuery.findAll({ page, limit, filter })
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.FOUNDED, result.termCondition, { limit, page, totalRecord: result.count, totalPage: Math.ceil(result.count / limit), search: query.search })

}

const termAndConditionService = {
    create,
    update,
    fetchOne,
    deleteOne,
    fetchAll,
    findTermAndCondition
}
export default termAndConditionService