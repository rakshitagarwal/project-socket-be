import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
} from "./../common/constants.js";
import { login, register, remove } from "./user-handlers.js";
import { validate } from "../middleware/validate.js";
import { registers } from "./../common/validationSchemas.js";

export const userRouter = Router();
userRouter
  .post(USER_LOGIN, login)
  .post(USER_REGISTER, validate.requestBody(registers), register)
  .delete(ID_POSTFIX, remove);
