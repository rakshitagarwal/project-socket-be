import { Router } from "express";
import { USER_PATH } from "../common/constants.js";

export const userRouter = Router();

userRouter.get(USER_PATH.USER_REGISTER);
