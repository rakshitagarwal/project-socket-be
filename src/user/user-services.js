import {
  isExist,
  create,
  getRoleUser,
  removeUser,
  getUserById,
} from "./user-queries.js";
import cr from "crypto-js";
import { helpers } from "../helper/helpers.js";
import { createResponse } from "../common/utilies.js";
export const checkCredentials = async function (user) {
  const queryResult = await isExist(user.emailAddress, user.passwordHash);
  return createResponse(helpers.StatusCodes.OK, {
    message: `User authenticated`,
  });
};

export const createUser = async (user) => {
  const hashDigest = cr.SHA256(user.password).toString();
  user.password = hashDigest;
  const userRoleId = await getRoleUser();
  user.Role = userRoleId;
  const usersMeta = await create(user);

  if (usersMeta !== undefined) {
    return createResponse(helpers.StatusCodes.CREATED, {
      usersMeta,
    });
  }
  return createResponse(helpers.StatusCodes.BAD_REQUEST, {
    message: helpers.StatusMessages.BAD_REQUEST,
  });
};
export const deleteUser = async (id) => {
  const userMeta = await getUserById(id);

  if (userMeta) {
    const metaData = await removeUser(id);

    if (metaData) {
      return createResponse(helpers.StatusCodes.OK, {
        message: `User Deleted Successefully `,
      });
    }
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};
