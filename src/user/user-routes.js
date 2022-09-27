import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
  USER_PATH_ALLID,
  USER_RESET,
} from "./../common/constants.js";
import {
  login,
  register,
  remove,
  update,
  get,
  user_reset,
} from "./user-handlers.js";
import { validateSchema } from "../middleware/validate.js";
import {
  registerSchema,
  idSchema,
  loginSchema,
} from "./../common/validationSchemas.js";

export const userRouter = Router();
userRouter
  .post(USER_LOGIN, validateSchema.body(loginSchema), login)
  .post(USER_REGISTER, validateSchema.body(registerSchema), register)
  .delete(ID_POSTFIX, validateSchema.params(idSchema), remove)
  .put(ID_POSTFIX, update)
  .get(USER_PATH_ALLID, get)
  .post(USER_RESET, user_reset);
