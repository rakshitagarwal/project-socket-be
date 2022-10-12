import { authSchemas } from "./role-schema.js";

/**
 * @description get list of privilages module waise for specific role id.
 * @param {string} roleId
 */
export const getPrivilagesForRole = async function (roleId) {
  const queryResult = await authSchemas.rolePrivilage
    .findOne({ role: roleId })
    .select({
      module: 1,
      _id: 0,
    })
    .lean();
  return queryResult;
};

export const getRoleById = async (role) => {
  const id = await authSchemas.roleSchema
    .findOne({ name: role })
    .select({ _id: 1, name: 0, status: 0 })
    .lean();

  return id;
};
