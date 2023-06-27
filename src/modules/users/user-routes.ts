import asyncHandler from "express-async-handler"
import { ENDPOINTS } from "../../common/constants"
import { Router } from "express"
import validateRequest from "../../middlewares/validateRequest"
import userSchemas from "./user-schemas"
import userHandlers from "./user-handlers"
import isAuthenticated from "../../middlewares/authentication"

export const userRoutes: Router = Router()

userRoutes.post(ENDPOINTS.REGISTER, [validateRequest.body(userSchemas.register)], asyncHandler(userHandlers.register))
userRoutes.patch(ENDPOINTS.VERIFY, [validateRequest.body(userSchemas.emailVerifcation)], asyncHandler(userHandlers.otpVerification))
userRoutes.post(ENDPOINTS.ADMIN_LOGIN, [validateRequest.body(userSchemas.adminLogin)], asyncHandler(userHandlers.adminLogin))
userRoutes.post(ENDPOINTS.LOGIN, [validateRequest.body(userSchemas.login)], asyncHandler(userHandlers.playerLogin))
userRoutes.put(ENDPOINTS.LOGOUT, [isAuthenticated], asyncHandler(userHandlers.logout))