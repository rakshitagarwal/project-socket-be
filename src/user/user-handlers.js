import {
  checkCredentials,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  userForget,
  userPermission,
  userSetResetPass,
  logOut,
} from "./user-services.js";
import { convertToSpecificLang } from "../common/utilies.js";

/**
 * @description handles post request for login service
 * @param req { Request } admin or vendor or player's request object
 * @param res { Response } admin or vendor or player's request's response object
 */
export const login = async (req, res) => {
  const { statusCode, response } = await checkCredentials(req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description handles admin or vendor or player registration
 * @param req { Request } - admin or vendor or player's request object
 * @param res { Response }
 */
export const register = async (req, res) => {
  const { statusCode, response } = await createUser(req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description handles  user remove data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const remove = async (req, res) => {
  const { statusCode, response } = await deleteUser(req.params.id);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description handles  user update data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const update = async (req, res) => {
  const { statusCode, response } = await updateUser(req.params.id, req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description handles  user get data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const get = async (req, res) => {
  const roleuserName = res.locals.Role.name;
  const data = req.params[0];
  const { statusCode, response } = await getUser(
    parseInt(req?.query?.page),
    parseInt(req?.query?.limit),
    data,
    roleuserName
  );
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description this API permission for role privilage.
 * @param req { Request } - admin or vendor or player's request object
 * @param res { Response }
 */
export const permission = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { statusCode, response } = await userPermission(token);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description this API forget a email for admin or vendor or player
 * @param req { Request } - admin or vendor or player's request object
 * @param res { Response }
 */
export const forget = async (req, res) => {
  const { statusCode, response } = await userForget(req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description This API set a password for admin or vendor or player
 * as well as a forgotten password used to set a password.
 * @param req { Request } - admin or vendor or player's request object
 * @param res { Response }
 */
export const userSetResetPassword = async (req, res) => {
  const { statusCode, response } = await userSetResetPass(req.params, req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

/**
 * @description This API logout current admin or vendor or player to used.
 * @param req { Request } - admin or vendor or player's request object
 * @param res { Response }
 */
export const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { statusCode, response } = await logOut(token);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};
