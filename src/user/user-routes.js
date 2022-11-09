import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTER,
  ID_POSTFIX,
  USER_PATH_ALLID,
  USER_FORGET,
  USER_PERMISSION,
  USER_LOGOUT,
  USER_SET_OR_RESET,
} from "./../common/constants.js";
import {
  login,
  register,
  remove,
  update,
  get,
  user_permission,
  user_forget,
  user_SetReset_Password,
  logout,
} from "./user-handlers.js";
import { validateSchema } from "../middleware/validate.js";
import {
  userSchema,
  idSchema,
  loginSchema,
  userUpdateSchema,
  forgetPassword,
} from "./../common/validationSchemas.js";
import { isAuthenticated } from "../middleware/auth.js";
import { checkAccess } from "../middleware/acl.js";
export const userRouter = Router();
userRouter
  .post(USER_LOGIN, validateSchema.body(loginSchema), login)
  .post(USER_REGISTER, validateSchema.body(userSchema), register)
  .delete(
    ID_POSTFIX,
    validateSchema.params(idSchema),
    [isAuthenticated, checkAccess],
    remove
  )
  .put(
    ID_POSTFIX,
    validateSchema.body(userUpdateSchema),
    [isAuthenticated, checkAccess],
    update
  )
  .get(USER_PATH_ALLID, [isAuthenticated, checkAccess], get)
  .post(USER_PERMISSION, user_permission)
  .post(USER_FORGET, validateSchema.body(forgetPassword), user_forget)
  .post(USER_LOGOUT, isAuthenticated, logout)
  .post(USER_SET_OR_RESET, user_SetReset_Password);
