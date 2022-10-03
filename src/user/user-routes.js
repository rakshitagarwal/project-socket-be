import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
  USER_PATH_ALLID,
  USER_FORGET,
  USER_PERMISSION,
  USER_SETPASSWORD,
  USER_LOGOUT,
  USER_RESET,
} from "./../common/constants.js";
import {
  login,
  register,
  remove,
  update,
  get,
  user_permission,
  user_forget,
  reset_password,
  user_setpassword,
  logout,
} from "./user-handlers.js";
import { validateSchema } from "../middleware/validate.js";
import {
  userSchema,
  idSchema,
  loginSchema,
  userUpdateSchema,
} from "./../common/validationSchemas.js";
import { isAuthenticated } from "../middleware/auth.js";
export const userRouter = Router();
userRouter
  .post(USER_LOGIN, validateSchema.body(loginSchema), login)
  .post(USER_REGISTER, validateSchema.body(userSchema), register)
  .delete(ID_POSTFIX, validateSchema.params(idSchema), remove)
  .put(ID_POSTFIX, validateSchema.body(userUpdateSchema), update)
  .get(USER_PATH_ALLID, get)
  .post(USER_PERMISSION, user_permission)
  .post(USER_SETPASSWORD, user_setpassword)
  .post(USER_FORGET, user_forget)
  .post(USER_RESET, reset_password)
  .post(USER_LOGOUT, logout);
