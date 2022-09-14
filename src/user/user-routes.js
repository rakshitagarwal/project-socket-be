import { Router } from "express";
import { USER_LOGIN } from "./../common/constants.js";
import { login } from "./user-handlers.js"

export const userRouter = Router();

userRouter.post(USER_LOGIN, login);