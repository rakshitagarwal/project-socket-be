import cr from "crypto-js";
import { checkCredentials, createUser, deleteUser } from "./user-services.js";
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
