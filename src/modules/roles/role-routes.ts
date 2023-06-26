import asyncHandler from "express-async-handler"
import { ENDPOINTS } from "../../common/constants"
import { Router } from "express"
import roleHanders from "./role-handlers"
import validateRequest from "../../middlewares/validateRequest"
import roleSchemas from "./role-schemas"
export const roleRoutes: Router = Router()

roleRoutes.post(ENDPOINTS.BASE, [validateRequest.body(roleSchemas.role)], asyncHandler(roleHanders.createNewRole))
roleRoutes.get(ENDPOINTS.ID, [validateRequest.params(roleSchemas.roleId)], asyncHandler(roleHanders.fetchRole))
roleRoutes.get(ENDPOINTS.BASE, [validateRequest.query(roleSchemas.rolepagination)], asyncHandler(roleHanders.fetchAllRoles))