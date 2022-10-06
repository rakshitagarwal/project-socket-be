import {
  create,
  getRoleUser,
  removeUser,
  getUserById,
  update,
  getAllUser,
  getEmailUser,
  persistence,
  setUserPasscode,
  getRoleUsers,
  getUserByIdRole,
  getTokenUsers,
  updatePass,
  getPasscodeUsers,
  removeTokenUser,
  getPersistenaceUsers,
  getJwtTokenUsers,
  getTokenRemoveByIdUser,
  getResetUserById,
  getEmailUsers,
  getUserFind,
  search,
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

/**
 * @description login user into system
 * @param user user's request object
 */
export const checkCredentials = async function (user) {
  const emailCheck = await getEmailUser(user.email);
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
  const userEmailCheck = await getEmailUsers(user.email);
  const userVerifiedCheck = await getEmailUser(user.email);
  const { password, ...userdata } = user;
  if (password) {
    user.password = hashPassword(user.password);
  }

  if (userEmailCheck || userVerifiedCheck) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.REGISTRATION_USER_ALREADY_EXIST
    );
  } else {
    const userRoleId = await getRoleUser(user.Role);
    if (userRoleId) {
      user.Role = userRoleId;
      const usersMeta = await create(user);
      if (!usersMeta.password) {
        const randomPasscode = Math.round(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
        const data = await setUserPasscode(
          usersMeta._id,
          hashPassword(randomPasscode, user.email)
        );
        const passCodeUser = await getUserById(data._id);
        const link = passCodeUser.passcode;
        // await sendEmail(data, "user-created", randomPasscode, link);
        return createResponse(
          helpers.StatusCodes.CREATED,
          helpers.responseMessages.USER_CHECK_EMAIL_PASS
        );
      }
      return createResponse(
        helpers.StatusCodes.CREATED,
        helpers.responseMessages.USER_REGISTER_CREATED_SUCC
      );
    }
    return createResponse(
      helpers.StatusCodes.UNAUTHORIZED,
      helpers.responseMessages.USER_REGISTER_ROLE_NOT_EXIST
    );
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
    if (!metaData) {
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
    const getUser = await getUserFind(id);

    if (getUser) {
      const updateUser = await update(id, userdata);
      const { password, email, Role, createdAt, passcode, ...userData } =
        getUser;
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
        ? await getUserFind(userid)
        : await getAllUser(page, limit);
    const { passcode, password, createdAt, ...getuserInfo } = userMeta;
    if (userMeta) {
      !userid
        ? userMeta.users.forEach((element) => {
            delete element.Role;
            delete element.passcode;
            delete element.password;
            delete element.createdAt;
            userInfo.push(element);
          })
        : userInfo.push(getuserInfo);
      if (userInfo && userMeta !== null) {
        return createResponse(
          helpers.StatusCodes.OK,
          !userid
            ? helpers.responseMessages.USER_GET_ALL
            : helpers.responseMessages.USER_GET_ID,
          userInfo,
          {
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
  const dataToken = await getRoleUsers(token);
  if (dataToken) {
    const getRoleId = await getUserByIdRole(dataToken);
    const getUser = await getUserFind(getRoleId.User);
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

export const userForget = async (user) => {
  const randomPasscode = Math.round(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  const userData = await getEmailUser(user.email);
  if (!userData) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.USER_INVALID_LINK
    );
  }
  await setUserPasscode(userData._id, hashPassword(randomPasscode, user.email));
  const userId = await getResetUserById(userData._id);
  if (userId) {
    const link = userId.passcode;
    await sendEmail(userData, "user-forget", randomPasscode, link);
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.USER_CHECK_EMAIL_PASS
    );
  }
  return notFound();
};
export const userSetpassword = async (tokenId, pass) => {
  const data = await getTokenUsers(tokenId.passcode);
  if (data) {
    const hashPass = hashPassword(pass.password);
    data.password = hashPass;
    data.verified = true;
    const checkUser = await updatePass(data._id, data);
    if (checkUser) {
      return createResponse(
        helpers.StatusCodes.ACCEPTED,
        helpers.responseMessages.USER_SET_PASS_SUCESSFULL
      );
    }
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.USER_ALREADY_USES
  );
};
export const resetPassword = async (tokenId, pass) => {
  const data = await getPasscodeUsers(tokenId.passcode);
  if (tokenId) {
    const dataUser = await getPersistenaceUsers(data._id);
    const arr = [];
    dataUser.forEach((data) => {
      arr.push(data._id);
    });

    await removeTokenUser(arr);
    if (data && data.passcode !== null) {
      const hashPass = hashPassword(pass.password);
      data.password = hashPass;
      data.flag = true;
      data.passcode = null;
      const userUpdate = await updatePass(data._id, data);
      return createResponse(
        helpers.StatusCodes.ACCEPTED,
        helpers.responseMessages.USER_RESET_SUCESSFULL
      );
    }
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.USER_ALREADY_USES
    );
  }
  return notFound();
};
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
  } else if (jwttoken == undefined) {
    return notFound();
  }
};

export const findUser = async (query) => {
  const filters = query;
  const page = parseInt(query.page) || 0;
  const limit = parseInt(query.limit) || 5;
  // const searchText = query.searchText || "";
  const searched = await search(page, limit, filters);
  // return createResponse(helpers.StatusCodes.OK, "search", searched);
};
/**
 * @description page not found.
 */
const notFound = () =>
  createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
