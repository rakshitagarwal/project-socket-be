import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
  USER_PATH,
  USER_PATH_ALLID,
} from "./../common/constants.js";
import { login, register, remove, update, get } from "./user-handlers.js";
import { validateSchema } from "../middleware/validate.js";
import { registers,idSchema } from "./../common/validationSchemas.js";

export const userRouter = Router();
userRouter
  .post(USER_LOGIN, login)
  .post(USER_REGISTER, register)
  .delete(ID_POSTFIX,validateSchema.params(idSchema), remove)
  .put(ID_POSTFIX, update)
  .get(USER_PATH_ALLID, get);
