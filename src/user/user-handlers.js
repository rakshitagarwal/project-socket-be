import {
  checkCredentials,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  resetPassword,
} from "./user-services.js";
import { convertToSpecificLang } from "../common/utilies.js";

/**
 * @description handles post request for login service
 * @param req { Request } user's request object
 * @param res { Response } user's request's response object
 */
export const login = async function (req, res) {
  await  checkCredentials(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles user registration
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const register = async function (req, res) {
 await createUser(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles  user remove data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const remove = async (req, res) => {
 await deleteUser(req.params.id).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles  user update data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const update = async (req, res) => {
 await updateUser(req.params.id, req.body).then((data) =>
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
 await getUser(parseInt(req?.query?.page), parseInt(req?.query?.limit), data).then(
    (data) => res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};

/**
 * @description handles user registration
 * @param req { Request } - user's request object
 * @param res { Response }
 */
export const user_reset = async function (req, res) {
 await resetPassword(req.body).then((data) =>
    res.status(data.statusCode).json(convertToSpecificLang(data, res))
  );
};
