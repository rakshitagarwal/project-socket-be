import {
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser,
  getEmailUser,
  persistence,
} from "./user-queries.js";
import { calculatePrivilages, hashPassword } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { createResponse, generateAccessToken } from "../common/utilies.js";
import { getPrivilagesForRole } from "../roles/role-queries.js";

/**
 * @description login user into system
 * @param user user's request object
 */
export const checkCredentials = async function (user) {
  const emailCheck = await getEmailUser(user);
  if (!emailCheck) {
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      helpers.responseMessages.LOGIN_USER_ALREADY_EXIST
    );
  }
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
  //compare password into hash password
  if (emailCheck.password === hashPassword(user.password)) {
    const genratAccToken = await generateAccessToken(getUser);
    genratAccToken.User = getUser._id;
    const token = await persistence(genratAccToken);
    const accessToken = token.accessToken;
    return createResponse(
      helpers.StatusCodes.CREATED,
      helpers.responseMessages.USER_LOGIN,
      {
        userInfo: getUser,
        accessToken: accessToken,
        permission: PermissionData,
      }
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.LOGIN_WRONG_CREDENTIALS
  );
};

/**
 * @description register user into databse
 * @param user - user registration's request body
 */
export const createUser = async (user) => {
  try {
    const emailCheck = await getEmailUser(user);
    if (emailCheck) {
      return createResponse(
        helpers.StatusCodes.ACCEPTED,
        helpers.responseMessages.REGISTRATION_USER_ALREADY_EXIST
      );
    } else {
      user.password = hashPassword(user.password);
      const userRoleId = await getRoleUser(user.Role);
      if (userRoleId) {
        user.Role = userRoleId;
        const usersMeta = await create(user);
        if (usersMeta) {
          return createResponse(
            helpers.StatusCodes.CREATED,
            helpers.responseMessages.USER_REGISTER_CREATED_SUCC,
            usersMeta
          );
        }
      } else {
        return createResponse(
          helpers.StatusCodes.BAD_REQUEST,
          helpers.responseMessages.USER_REGISTER_ROLE_NOT_EXIST
        );
      }
    }
  } catch (error) {
    return notFound();
  }
};

/**
 * @description user into databse
 * @param id -  user id request body
 */
export const deleteUser = async (id) => {
  try {
    const metaData = await removeUser(id);
    if (metaData) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_DELETE_SUCC
      );
    }
  } catch (error) {
    return notFound();
  }
};

/**
 * @description update user into databse
 * @param id - user update's request body
 * @param - user into database
 */
export const updateUser = async (id, userdata) => {
  try {
    const updateUser = await update(id, userdata);
    const getuser = await getUserById(id);
    const { password, email, Role, ...userData } = getuser;
    if (updateUser) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_UPDATE_SUCC,
        userData
      );
    }
  } catch (error) {
    return notFound();
  }
};

/**
 * @description Get All user into databse and get use get byId
 * @param page -  for used to page
 * @param  limit-  for used to limit page
 * @param  userid -  user update's request body
 */
export const getUser = async (page, limit, userid) => {
  try {
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
        !userid
          ? helpers.responseMessages.USER_GET_ALL
          : helpers.responseMessages.USER_GET_ID,
        {
          userInfo,
          limit: userMeta.limit,
          currentPage: userMeta.currentPage,
          totalPages: userMeta.pages,
          count: userMeta.count,
        }
      );
    }
  } catch (error) {
    return notFound();
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
