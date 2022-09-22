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
import { calculatePrivilages, hassPassword } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { createResponse, generateAccessToken } from "../common/utilies.js";
import { getPrivilagesForRole } from "../roles/role-queries.js";

const notFound = () =>
  createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );

export const checkCredentials = async function (user, req) {
  const emailCheck = await getEmailUser(user);

  if (!emailCheck) {
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      helpers.StatusMessages.EMAIL_UNREGISTER + ` ${user.email}`
    );
  } else {
    const { password, ...getUser } = emailCheck;
    const getPrivilageRole = await getPrivilagesForRole(getUser.Role);
    let PrivilageRole = [];
    getPrivilageRole.module.forEach((element) => {
      const calPrivilage = calculatePrivilages(element.privilageNumber);
      element.ActionRole = calPrivilage;
      delete element._id;
      delete element.privilageNumber;
      PrivilageRole.push(element);
    });
    const PermissionData = Object.assign({}, PrivilageRole);
    if (emailCheck.password === hassPassword(user.password)) {
      const genratAccToken = await generateAccessToken(getUser);
      genratAccToken.User = getUser._id;
      const token = await persistence(genratAccToken);
      const accessToken = token.accessToken;
      return createResponse(helpers.StatusCodes.CREATED, "login user", {
        UserInfo: getUser,
        accessToken: accessToken,
        Permission: PermissionData,
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
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      helpers.StatusMessages.EMAIL_ALREADY + `${user.email}`
    );
  } else {
    user.password = hassPassword(user.password);
    const userRoleId = await getRoleUser(user.Role);
    user.Role = userRoleId;
    const usersMeta = await create(user);
    if (usersMeta) {
      return createResponse(
        helpers.StatusCodes.CREATED,
        "User Created Successefully",
        usersMeta
      );
    }
  }
  return notFound();
};

export const deleteUser = async (id) => {
  const metaData = await removeUser(id);
  if (metaData) {
    return createResponse(helpers.StatusCodes.OK, "User Deleted Successefully");
  }
  return notFound();
};

export const updateUser = async (id, userdata) => {
  const updateUser = await update(id, userdata);
  const getuser = await getUserById(id);
  if (updateUser) {
    return createResponse(
      helpers.StatusCodes.OK,
      `User ${getuser.fullName} successfully`,
      getuser
    );
  }
  return notFound();
};

export const getUser = async (page, limit, userid) => {
  const userMeta =
    userid.length > 0
      ? await getUserById(userid)
      : await getAllUser(page, limit);
  userMeta.limit = userMeta.limit;
  userMeta.currentPage = userMeta.currentPage;
  userMeta.totalPages = userMeta.totalPages;
  if (userMeta) {
    return createResponse(
      helpers.StatusCodes.OK,
      !userid ? "All user Show" : "user get by Id",
      userMeta
    );
  }
  return notFound();
};
