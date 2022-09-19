import cr from "crypto-js";
import {
  checkCredentials,
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "./user-services.js";
export const login = async function (req, res) {
  const { statusCode, response } = await checkCredentials(req.body);
  res.status(statusCode).json(response);
};
export const register = async function (req, res) {
  const { statusCode, response } = await createUser(req.body);
  res.status(statusCode).json(response);
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteUser(req.params.id);
  res.status(statusCode).json(response);
};
export const update = async (req, res) => {
  const { statusCode, response } = await updateUser(req.params.id, req.body);
  res.status(statusCode).json(response);
};

export const get = async (req, res) => {
  const data = req.params[0];
  const { statusCode, response } = await getUser(
    parseInt(req?.query?.page),
    parseInt(req?.query?.limit),
    data
  );
  res.status(statusCode).json(response);
};
