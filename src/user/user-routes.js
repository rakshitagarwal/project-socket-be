import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
  USER_PATH,
  USER_PATH_ALLID,
} from "./../common/constants.js";
import { login, register, remove, update, get } from "./user-handlers.js";
import { validate } from "../middleware/validate.js";
import { registers } from "./../common/validationSchemas.js";

export const userRouter = Router();
userRouter
  .post(USER_LOGIN, login)
  .post(USER_REGISTER, validate.requestBody(registers), register)
  .delete(ID_POSTFIX, remove)
  .put(ID_POSTFIX, update)
  .get(USER_PATH_ALLID, get);
  