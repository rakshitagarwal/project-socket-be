import {
  isExist,
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser,
  getEmailUser,
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

const notFound = () =>
  createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });

export const createUser = async (user) => {
  const emailCheck = await getEmailUser(user);
  if (emailCheck) {
    return createResponse(helpers.StatusCodes.ACCEPTED, {
      message: helpers.StatusMessages.EMAIL_ALREADY + `${user.email}`,
    });
  } else {
    const hashDigest = cr.SHA256(user.password).toString();
    user.password = hashDigest;
    const userRoleId = await getRoleUser();
    user.Role = userRoleId;
    const usersMeta = await create(user);
    if (usersMeta && usersMeta !== undefined) {
      return createResponse(helpers.StatusCodes.CREATED, {
        message: helpers.StatusMessages.USER_CREATE,
        usersMeta,
      });
    }
  }
  return notFound();
};
export const deleteUser = async (id) => {
  const metaData = await removeUser(id);
  if (metaData && typeof meta === "object") {
    return createResponse(helpers.StatusCodes.OK, {
      message: helpers.StatusMessages.USER_DELETE,
    });
  }
  return notFound();
};

export const updateUser = async (id, userdata) => {
  const userMeta = await getUserById(id);
  console.log(userMeta);
  if (userMeta && typeof userMeta === "object") {
    const updateUser = await update(id, userdata);
    if (updateUser && typeof updateUser === "object") {
      return createResponse(helpers.StatusCodes.OK, {
        message: `User name ${userMeta.fullName} updated `,
      });
    }
  }
  return notFound();
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
  return notFound();
};
