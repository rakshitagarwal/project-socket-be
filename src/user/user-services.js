import {
  isExist,
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser,
  getEmailUser,
  persistence,
} from "./user-queries.js";
import { hassPassword } from "../common/utilies.js";
import env from "../config/env.js";
import cr from "crypto-js";
import crypto from "crypto";
import { helpers } from "../helper/helpers.js";
import { createResponse, generateAccessToken } from "../common/utilies.js";

const notFound = () =>
  createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });

export const checkCredentials = async function (user) {
  const emailCheck = await getEmailUser(user);

  if (!emailCheck) {
    return createResponse(helpers.StatusCodes.ACCEPTED, {
      message: helpers.StatusMessages.EMAIL_UNREGISTER + ` ${user.email}`,
    });
  } else {
    const hassData = hassPassword(user.password);
    const { password, ...getUser } = emailCheck;
    if (emailCheck.password === hassData) {
      const genratAccToken = await generateAccessToken(getUser);
      const token = await persistence(genratAccToken);
      const accessToken = token.accessToken;
      return createResponse(helpers.StatusCodes.CREATED, {
        message: helpers.StatusMessages.USER_LOGIN,
        getUser,
        accessToken,
      });
    }
    return createResponse(helpers.StatusCodes.BAD_REQUEST, {
      message: helpers.StatusMessages.UNAUTHORIZED,
    });
  }
};

export const createUser = async (user) => {
  const emailCheck = await getEmailUser(user);
  if (emailCheck) {
    return createResponse(helpers.StatusCodes.ACCEPTED, {
      message: helpers.StatusMessages.EMAIL_ALREADY + `${user.email}`,
    });
  } else {
    const hassData = hassPassword(user.password);
    user.password = hassData;
    const userRoleId = await getRoleUser(user.Role);
    user.Role = userRoleId;
    const usersMeta = await create(user);
    if (usersMeta) {
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
  if (metaData) {
    return createResponse(helpers.StatusCodes.OK, {
      message: helpers.StatusMessages.USER_DELETE,
    });
  }
  return notFound();
};

export const updateUser = async (id, userdata) => {
  const updateUser = await update(id, userdata);
  const getuser = await getUserById(id);
  if (updateUser) {
    return createResponse(helpers.StatusCodes.OK, {
      message: `User ${getuser.fullName} successfully `,
      getuser,
    });
  }
  return notFound();
};

export const getUser = async (page, limit, userid) => {
  const userMeta =
    userid.length > 0
      ? await getUserById(userid)
      : await getAllUser(page, limit);
  if (userMeta) {
    return createResponse(helpers.StatusCodes.OK, userMeta, {
      limit: userMeta.limit,
      currentPage: userMeta.currentPage,
      totalPages: userMeta.pages,
    });
  }
  return notFound();
};
