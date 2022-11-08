import {
  create,
  roleSchema,
  removeUser,
  getUserById,
  update,
  getAllUser,
  userExists,
  persistence,
  userPassCodeUpdate,
  getRoleAccessToken,
  getUserByIdRole,
  updatePass,
  removeTokenUser,
  getPersistenaceUsers,
  getJwtTokenUsers,
  getTokenRemoveByIdUser,
  getResetUserById,
  emailVerfiedUser,
  getUserByIdVerfied,
  roleSchemaName,
  roleSchemaFind,
  getAllUserRole,
  getSetResetPassUser,
  userTemporaryExists,
  getRoleSchemaName,
} from "./user-queries.js";
import {
  calculatePrivilages,
  hashPassword,
  createResponse,
  generateAccessToken,
  sendEmail,
  validateObjectId,
} from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { getPrivilagesForRole } from "../roles/role-queries.js";
import env from "../config/env.js";

/**
 * @description login user into system
 * @param user user's request object
 */
export const checkCredentials = async function (user) {
  const emailCheck = await userExists(user.email);
  const userExistsTemp = await userTemporaryExists(user.email);
  if (!emailCheck || userExistsTemp) {
    return createResponse(
      helpers.StatusCodes.UNAUTHORIZED,
      userExistsTemp
        ? helpers.responseMessages.USER_TEMPORARY_BLOCKED
        : helpers.responseMessages.LOGIN_USER_ALREADY_EXIST
    );
  }
  const { password, passcode, createdAt, updatedAt, ...getUser } = emailCheck;
  const getPrivilageRole = await getPrivilagesForRole(getUser.Role);
  let PrivilageRole = [];
  getPrivilageRole.module.forEach((element) => {
    const calPrivilage = calculatePrivilages(element.privilageNumber);
    element.ActionRole = calPrivilage;
    delete element._id;
    delete element.privilageNumber;
    PrivilageRole.push(element);
  });

  //compare password into hash password
  if (emailCheck.password === hashPassword(user.password)) {
    const getAccessToken = await generateAccessToken(getUser);
    getAccessToken.User = getUser._id;

    const token = await persistence(getAccessToken);
    const accessToken = token.accessToken;
    return createResponse(
      helpers.StatusCodes.CREATED,
      helpers.responseMessages.USER_LOGIN,
      {
        userInfo: getUser,
        accessToken: accessToken,
        permission: PrivilageRole,
      }
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.LOGIN_WRONG_CREDENTIALS
  );
};

/**
 * @param user - user registration's request body
 * @description register user into databse
 */
export const createUser = async (user) => {
  const userEmailCheck = await emailVerfiedUser(user.email);
  const { password, ...userdata } = user;
  if (password) {
    user.password = hashPassword(user.password);
  }

  if (userEmailCheck) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.REGISTRATION_USER_ALREADY_EXIST
    );
  }
  const userRoleId = await roleSchema(user.Role);
  const userRoleName = await roleSchemaName(user.Role);
  if (userRoleId) {
    user.Role = userRoleId;
    const usersMeta = await create(user);
    if (!usersMeta.password) {
      const randomCode = Math.round(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      const userData = await userPassCodeUpdate(
        usersMeta._id,
        hashPassword(randomCode, user.email)
      );

      const passCodeUser = await getUserById(userData._id);
      const link = passCodeUser.passcode;

      const selectTemplate =
        userRoleName.name === "Player" || user.Role === "Player"
          ? "player-user"
          : "user-created";
      sendEmail(userData, selectTemplate, randomCode, link, env.LIVE_ULR);

      return createResponse(
        helpers.StatusCodes.CREATED,
        helpers.responseMessages.USER_CHECK_EMAIL
      );
    }
    return createResponse(
      helpers.StatusCodes.CREATED,
      helpers.responseMessages.USER_REGISTER_CREATED
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.USER_REGISTER_ROLE_NOT_EXIST
  );
};

/**
 * @param id -  user id request param
 * @description user into database
 */
export const deleteUser = async (id) => {
  // Yes, it's a valid ObjectId, proceed with `findById` call.
  const userObjId = validateObjectId(id);
  if (userObjId) {
    const userData = await removeUser(id);
    if (!userData || userData.status) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.responseMessages.USER_INVALID
      );
    }
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_DELETE_SUCCESSFULL
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.USER_INVALID
  );
};

/**
 * @param id - user update's request body
 * @param userdata - user's request body
 * @description update user into databse
 */
export const updateUser = async (id, userdata) => {
  // Yes, it's a valid ObjectId, proceed with `findById` call.
  const userObjId = validateObjectId(id);
  const data = userdata.isblock ? userdata : userdata;
  if (data.isblock && userObjId) {
    const dataVerfied = await getUserByIdVerfied(id);
    sendEmail(dataVerfied, "user-blocked");
    if (!dataVerfied.isblock) {
      await update(id, data);
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_DISABLE
      );
    }
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.USER_ALREADY_BLOCK
    );
  } else if (data.isblock === false && userObjId) {
    await update(id, data);
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_ENABLE
    );
  }

  if (userObjId) {
    let userRoleId = await roleSchema(data.Role);
    if (!userRoleId && !data.isblock) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.responseMessages.USER_REGISTER_ROLE_NOT_EXIST
      );
    }
    if (data.Role) {
      data.Role = userRoleId;
    }
    await update(id, data);
    const getUsersVerfied = await getUserByIdVerfied(id);
    const { password, email, Role, createdAt, passcode, ...userData } =
      getUsersVerfied;
    if (getUsersVerfied) {
      return createResponse(
        helpers.StatusCodes.OK,
        data.isblock ? "" : helpers.responseMessages.USER_UPDATE_SUCCESSFULL,
        !data.isblock ? userData : ""
      );
    }
    return notFound();
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.USER_INVALID
  );
};

/**
 * @description Get All user into databse and get use get byId
 * @param page -  for used to page
 * @param  limit-  for used to limit page
 * @param  userid -  user update's request body
 */
export const getUser = async (page, limit, userid, roleName) => {
  // Yes, it's a valid ObjectId, proceed with `findById` call.
  if (!page || !limit || !roleName) {
    var userObjId = validateObjectId(userid);
  }
  if (userObjId && userid) {
    const userInfo = await getUserByIdVerfied(userid);
    const arr = [];
    const { password, passcode, isblock, updatedAt, createdAt, ...userData } =
      userInfo;
    if (userInfo) {
      arr.push(userData);
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_GET_ID,
        {
          userInfo: arr,
        }
      );
    }
    return notFound();
  } else if (userObjId === false && (page || limit || roleName) && userid) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.USER_INVALID
    );
  } else if (page || limit || roleName) {
    const userRoleId = await roleSchemaName(roleName);
    if (userRoleId.name === roleName && roleName === "Admin") {
      const roleUser = await roleSchemaFind();
      const userDatas = await getAllUserRole(page, limit, roleUser._id);
      const userInfo = [];
      userDatas.users.forEach((element) => {
        // delete element.Role;
        delete element.passcode;
        delete element.password;
        delete element.createdAt;
        userInfo.push(element);
      });

      if (userDatas.users.length) {
        return createResponse(
          helpers.StatusCodes.OK,
          helpers.responseMessages.USER_GET_ALL,
          {
            userInfo: userInfo,
          },
          {
            limit: userDatas.limit,
            currentPage: userDatas.currentPage,
            totalPages: userDatas.pages,
            count: userDatas.count,
          }
        );
      }
    } else if (userRoleId.name === roleName && roleName === "Vendor") {
      // TO DO comments (this function used to vendor for future)
    } else {
      // TO DO comments (this function used to other user for future)
    }
  }
  return notFound();
};

/**
 * @param token - get user token
 * @description  user permission allow to user role.
 */
export const userPermission = async (token) => {
  const tokenExists = await getRoleAccessToken(token);
  if (tokenExists) {
    const getRoleId = await getUserByIdRole(tokenExists);
    const getUser = await getUserByIdVerfied(getRoleId.User);
    const getPrivilageRole = await getPrivilagesForRole(getUser.Role);
    let permission = [];
    getPrivilageRole.module.forEach((element) => {
      const calPrivilage = calculatePrivilages(element.privilageNumber);
      element.ActionRole = calPrivilage;
      delete element._id;
      delete element.privilageNumber;
      permission.push(element);
    });
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_PERMISSION_ALLOW,
      {
        permission,
      }
    );
  }
  return createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    helpers.StatusMessages.UNAUTHORIZED
  );
};

/**
 * @param user - request body user email
 * @description - user forget
 */
export const userForget = async (user) => {
  const randomCode = Math.round(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const userData = await userExists(user.email);
  if (!userData) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.USER_INVALID_LINK
    );
  }
  await userPassCodeUpdate(userData._id, hashPassword(randomCode, user.email));
  const userId = await getResetUserById(userData._id);
  if (userId) {
    const link = userId.passcode;
    sendEmail(userData, "user-forget", randomCode, link, env.LIVE_ULR);
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_CHECK_EMAIL
    );
  }
  return notFound();
};

/**
 * @param tokenId - token exists or not
 * @param user - request body user in password field
 * @description - user set or reset password for verified the user.
 */
export const userSetResetPass = async (tokenId, user) => {
  let userData = await getSetResetPassUser(tokenId.passcode);
  const userRoleId = await getRoleSchemaName(userData.Role);

  if (!userData) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      tokenId.passcode.length !== 64
        ? helpers.responseMessages.USER_INVALID_LINK
        : helpers.responseMessages.USER_ALREADY_USES
    );
  }

  let userRoleData = await getPersistenaceUsers(userData._id);
  let randomCode = Math.round(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  if (tokenId || !user.password) {
    let hashPass = hashPassword(user.password ? user.password : randomCode);
    if (
      userData.verified ||
      (typeof userRoleData.length <= 0 && userRoleData)
    ) {
      const arr = [];
      userRoleData.forEach((data) => {
        arr.push(data._id);
      });
      await removeTokenUser(arr);
    }
    if (userRoleId.name === "Player") {
      sendEmail(userData, "player-user-verfiy", randomCode);
    }
    userData.password = hashPass;
    userData.verified = true;
    userData.passcode = null;
    await updatePass(userData._id, userData);
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      helpers.responseMessages.USER_SET_PASSWORD_SUCCESSFUL
    );
  }
  return notFound();
};

/**
 * @param jwttoken - token exists or not.
 * @description - user logout for user.
 */
export const logOut = async (jwttoken) => {
  if (jwttoken) {
    const dataId = await getJwtTokenUsers(jwttoken);
    if (dataId) {
      await getTokenRemoveByIdUser(dataId[0]._id);
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_LOGOUT
      );
    }
    return createResponse(
      helpers.StatusCodes.UNAUTHORIZED,
      helpers.responseMessages.USER_LOGOUT_ALREADY
    );
  }
};

/**
 * @description page not found.
 */
const notFound = () =>
  createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
