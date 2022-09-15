import {
  isExist,
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser
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
      message: `User Created Successefully`,
      usersMeta,
    });
  }
  return createResponse(helpers.StatusCodes.BAD_REQUEST, {
    message: helpers.StatusMessages.BAD_REQUEST,
  });
};
export const deleteUser = async (id) => {
  const userMeta = await getUserById(id);
  if (userMeta && typeof userMeta === "object") {
    const metaData = await removeUser(id);
    if (metaData && typeof updateUser === "object") {
      return createResponse(helpers.StatusCodes.OK, {
        message: `User Deleted Successefully `,
      });
    }
  }
  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};

export const updateUser = async (id, userdata) => {
  const userMeta = await getUserById(id);
  if (userMeta && typeof userMeta === "object") {
    const updateUser = await update(id, userdata);
    console.log(typeof updateUser);
    if (updateUser && typeof updateUser === "object") {
      return createResponse(helpers.StatusCodes.OK, {
        message: `User name ${userMeta.fullName} updated `,
      });
    }
  }
  return createResponse(helpers.StatusCodes.BAD_REQUEST, {
    message: helpers.StatusMessages.BAD_REQUEST,
  });
};

export const getUser = async (page, limit, userid) => {
  const userMeta =
    userid.length > 0
      ? await getUserById(userid)
      : await getAllUser(page, limit);
  if (userMeta && typeof userMeta === "object") {
    return createResponse(helpers.StatusCodes.OK, userMeta, {
      limit: userMeta.limit,
      currentPage: userMeta.currentPage,
      totalPages: userMeta.pages,
    });
  }
  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};