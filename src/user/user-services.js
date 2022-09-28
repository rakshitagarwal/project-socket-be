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
  getRoleUsers,
  getUserByIdRole,
  getTokenUsers,
  updatePass,
} from "./user-queries.js";
import {
  calculatePrivilages,
  hashPassword,
  createResponse,
  generateAccessToken,
  sendEmail,
  verifyJwtToken,
  validateObjectId,
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
  console.log(":::>>>>", user);
  const { password, ...userdata } = user;
  if (password) {
    user.password = hashPassword(user.password);
  }

  if (emailCheck) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.REGISTRATION_USER_ALREADY_EXIST
    );
  } else {
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
        helpers.StatusCodes.UNAUTHORIZED,
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
  const userId = validateObjectId(id);
  if (userId) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const metaData = await removeUser(id);

    if (metaData === null) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.responseMessages.USER_INVALID_ID
      );
    }
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_DELETE_SUCCESSFULL
    );
  }
  return notFound();
};

/**
 * @description update user into databse
 * @param id - user update's request body
 * @param - user into database
 */
export const updateUser = async (id, userdata) => {
  const userId = validateObjectId(id);
  if (userId) {
    const getuser = await getUserById(id);
    if (getuser?.status) {
      const updateUser = await update(id, userdata);
      const { password, email, Role, ...userData } = getuser;
      if (updateUser) {
        return createResponse(
          helpers.StatusCodes.OK,
          helpers.responseMessages.USER_UPDATE_SUCCESSFULL,
          userData
        );
      }
    }
    return notFound();
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
  const userCheck = validateObjectId(userid);
  if (userCheck || page || limit) {
    const userInfo = [];
    const userMeta =
      userid.length > 0
        ? await getUserById(userid)
        : await getAllUser(page, limit);
    if (userMeta !== undefined) {
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
    }
    return notFound();
  }
  return notFound();
};

export const userPermission = async (token) => {
  const data = await getRoleUsers(token);
  if (data) {
    const getRoleId = await getUserByIdRole(data);
    const getuser = await getUserById(getRoleId.User);
    const getPrivilageRole = await getPrivilagesForRole(getuser.Role);
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

export const userReset = async (user) => {
  const randomPasscode = Math.round(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const userData = await getEmailUser(user);
  console.log(userData);
  if (userData === null) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      "Invalid link or expired"
    );
  }
  const hashPass = hashPassword(randomPasscode, user.email);
  await setUserPasscode(userData._id, hashPass);
  const link = `http://localhost:3300/v1/users/password-reset/${hashPass}`;
  await sendEmail(userData, "user-created", randomPasscode, link);
  return createResponse(helpers.StatusCodes.OK, "email sent sucessfully");
};
export const resetPassword = async (tokenId, pass) => {
  const data = await getTokenUsers(tokenId);
  if (data) {
    const getuser = await getUserById(data.User);
    const hashPass = hashPassword(pass.password);
    getuser.password = hashPass;
    const dd = await updatePass(getuser._id, getuser);
    return createResponse(
      helpers.StatusCodes.ACCEPTED,
      "password reset sucessfully"
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
