import asyncHandler from "express-async-handler"
import { ENDPOINTS } from "../../common/constants"
import { Router } from "express"
import validateRequest from "../../middlewares/validateRequest"
import userSchemas from "./user-schemas"
import userHandlers from "./user-handlers"
import isAuthenticated from "../../middlewares/authentication"

export const userRouter: Router = Router()

userRouter.post(ENDPOINTS.REGISTER, [validateRequest.body(userSchemas.register)], asyncHandler(userHandlers.register))
userRouter.patch(ENDPOINTS.VERIFY, [validateRequest.body(userSchemas.emailVerifcation)], asyncHandler(userHandlers.otpVerification))
userRouter.post(ENDPOINTS.ADMIN_LOGIN, [validateRequest.body(userSchemas.adminLogin)], asyncHandler(userHandlers.adminLogin))
userRouter.post(ENDPOINTS.LOGIN, [validateRequest.body(userSchemas.login)], asyncHandler(userHandlers.playerLogin))
userRouter.put(ENDPOINTS.LOGOUT, [isAuthenticated], asyncHandler(userHandlers.logout))