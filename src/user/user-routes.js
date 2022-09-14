import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
} from "./../common/constants.js";
import { login, register, remove } from "./user-handlers.js";

export const userRouter = Router();
import { checkBody } from "../middleware/validate.js";
userRouter
  .post(USER_LOGIN, login)
  .post(USER_REGISTER, checkBody, register)
  .delete(ID_POSTFIX, remove);
