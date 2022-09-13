import { helpers } from "./../helper/helpers.js";
import { createResponse } from "./../common/utilies";
import { isExist } from "./user-queries.js";
export const checkCredentials = async function (user) {
    const queryResult = await isExist(user.emailAddress, user.passwordHash);
    return createResponse(helpers.StatusCodes.OK, {
        message: `User authenticated`,
    });
}