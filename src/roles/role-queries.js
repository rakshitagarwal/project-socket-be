import { authSchemas } from "./role-schema.js";

/**
 * @description get list of privilages module waise for specific role id.
 * @param {string} roleId 
 */
export const getPrivilagesForRole = async function (roleId) {
    const queryResult = await authSchemas.rolePrivilage.findOne({role : roleId}).select({
        module : 1,
        _id : 0
    }).lean();
    return queryResult;
}