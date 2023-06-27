import asyncHandler from "express-async-handler"
import { ENDPOINTS } from "../../common/constants"
import { Router } from "express"
import validateRequest from "../../middlewares/validateRequest"
import userSchemas from "./user-schemas"
import userHandlers from "./user-handlers"


export const userRoutes: Router = Router()

userRoutes.post(ENDPOINTS.REGISTER, [validateRequest.body(userSchemas.register)], asyncHandler(userHandlers.register))