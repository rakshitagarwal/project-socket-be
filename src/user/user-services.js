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
import { calculatePrivilages, hasPassword } from "../common/utilies.js";
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
    if (emailCheck.password === hasPassword(user.password)) {
      const genratAccToken = await generateAccessToken(getUser);
      genratAccToken.User = getUser._id;
      const token = await persistence(genratAccToken);
      const accessToken = token.accessToken;
      return createResponse(helpers.StatusCodes.CREATED, "login user", {
        userInfo: getUser,
        accessToken: accessToken,
        permission: PermissionData,
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
    user.password = hasPassword(user.password);
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
  const { password, email, Role, ...userData } = getuser;
  if (updateUser) {
    return createResponse(
      helpers.StatusCodes.OK,
      `${getuser.fullName} updated successfully`,
      userData
    );
  }
  return notFound();
};

export const getUser = async (page, limit, userid) => {
  const userInfo = [];
  const userMeta =
    userid.length > 0
      ? await getUserById(userid)
      : await getAllUser(page, limit);

  !userid
    ? userMeta.users.forEach((element) => {
        delete element.Role;
        delete element.password;
        userInfo.push(element);
      })
    : userInfo.push(userMeta);

  if (userInfo) {
    return createResponse(
      helpers.StatusCodes.OK,
      !userid ? "All user Show" : "user get by Id",
      {
        userInfo,
        limit: userMeta.limit,
        currentPage: userMeta.currentPage,
        totalPages: userMeta.pages,
        count: userMeta.count,
      }
    );
  }
  return notFound();
};
