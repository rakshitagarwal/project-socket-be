import termAndConditionQuery from "./term-condition-queries"
import { Icreate, Iupdate, Iid } from "./typings/term-condition-types"
import { responseBuilder } from "../../common/responses"
import { MESSAGES } from "../../common/constants"



/**
 * @description - Add new term and condition 
 * @param body - contains req.body data for term and conditions
 * @returns {Promise}
 */

const create = async (body: Icreate) => {
    const result = await termAndConditionQuery.create(body)
    if(!result){
        return responseBuilder.expectationField()
    }
    return responseBuilder.createdSuccess(MESSAGES.TERM_CONDITION.CREATED)
}

/**
 * @description - update the term and condition information 
 * @param {string} param - contains the unique identification
 * @param body - contains req.body data for term and conditions
 * @returns {Promise}
 */

const update=async (params:Iid,body:Iupdate)=>{
    const isTermAndCondition= await termAndConditionQuery.findOne(params)
    if(!isTermAndCondition){
        return responseBuilder.notFoundError(MESSAGES.TERM_CONDITION.NOT_FOUND)
    }
    const result= await termAndConditionQuery.update(params,body)
    if(!result){
        return responseBuilder.expectationField()
    }
    return responseBuilder.okSuccess(MESSAGES.TERM_CONDITION.UPDATED)
}

const termAndConditionService={
    create,
    update
}
export default termAndConditionService