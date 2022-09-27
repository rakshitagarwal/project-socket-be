import {
  checkCredentials,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  userReset,
  resetPassword,
  userPermission,
} from "./user-services.js";
import { convertToSpecificLang } from "../common/utilies.js";

/**
 * @description handles post request for login service
 * @param req { Request } user's request object
 * @param res { Response } user's request's response object
 */
export const login = function (req, res) {
  checkCredentials(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles user registration
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const register = function (req, res) {
  createUser(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles  user remove data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const remove = (req, res) => {
  deleteUser(req.params.id).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles  user update data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const update = (req, res) => {
  updateUser(req.params.id, req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles  user get data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const get = async (req, res) => {
  const data = req.params[0];
  getUser(parseInt(req?.query?.page), parseInt(req?.query?.limit), data).then(
    (data) => res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

export const user_permission = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  userPermission(token).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};
/**
 * @description handles user registration
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const user_reset = function (req, res) {
  userReset(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

export const reset_password = function (req, res) {
  resetPassword(req.params).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};
