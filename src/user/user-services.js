import {
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser,
  getEmailUser,
  persistence,
  findUserByEmail,
  setUserPasscode,
} from "./user-queries.js";
import {
  calculatePrivilages,
  hashPassword,
  createResponse,
  generateAccessToken,
  idCheck,
  sendEmail,
} from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { getPrivilagesForRole } from "../roles/role-queries.js";

/**
 * @description login user into system
 * @param user user's request object
 */
export const checkCredentials = async function (user) {
  const emailCheck = await getEmailUser(user);
  if (!emailCheck) {
    return createResponse(
      helpers.StatusCodes.UNAUTHORIZED,
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
 * @description register user into databse
 * @param user - user registration's request body
 */
export const createUser = async (user) => {
  const emailCheck = await getEmailUser(user);
  user.password = hashPassword(user.password);
  if (emailCheck) {
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      helpers.responseMessages.REGISTRATION_USER_ALREADY_EXIST
    );
  } else {
    // user.password = hashPassword(user.password);
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
};

/**
 * @description user into databse
 * @param id -  user id request body
 */
export const deleteUser = async (id) => {
  const userId = await idCheck(id);
  if (userId) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const metaData = await removeUser(id);
    if (metaData) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.USER_DELETE_SUCC
      );
    }
  }
  return notFound();
};

/**
 * @description update user into databse
 * @param id - user update's request body
 * @param - user into database
 */
export const updateUser = async (id, userdata) => {
  const userId = await idCheck(id);
  if (userId) {
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
  }
  return notFound();
};

/**
 * @description Get All user into databse and get use get byId
 * @param page -  for used to page
 * @param  limit-  for used to limit page
 * @param  userid -  user update's request body
 */
export const getUser = async (page, limit, userid) => {
  const userCheck = await idCheck(userid);
  const userInfo = [];
  const userMeta =
    userid.length > 0
      ? await getUserById(userCheck)
      : await getAllUser(page, limit);

  !userid
    ? userMeta.users.forEach((element) => {
        delete element.Role;
        delete element.password;
        userInfo.push(element);
      })
    : userInfo.push(userMeta);
  if (userInfo && userMeta !== null) {
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
  return notFound();
};
export const resetPassword = async (user) => {
  const randomPasscode = Math.round(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const userData = await getEmailUser(user);
  if (userData === null) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.StatusMessages.NOT_FOUND
    );
  }
  const encrypted = hashPassword(randomPasscode, user.email);
  const data = await setUserPasscode(userData._id, encrypted);
};

/**
 * @description page not found.
 */
const notFound = () =>
  createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
