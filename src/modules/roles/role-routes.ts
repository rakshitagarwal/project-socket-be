import asyncHandler from "express-async-handler";
import { ENDPOINTS } from "../../common/constants";
import { Router } from "express";
import roleHanders from "./role-handlers";
import validateRequest from "../../middlewares/validateRequest";
import roleSchemas from "./role-schemas";
export const roleRouter: Router = Router();

roleRouter.post(
    ENDPOINTS.BASE,
    [validateRequest.body(roleSchemas.role)],
    asyncHandler(roleHanders.createNewRole)
);
roleRouter.get(
    ENDPOINTS.ID,
    [validateRequest.params(roleSchemas.roleId)],
    asyncHandler(roleHanders.fetchRole)
);
roleRouter.get(
    ENDPOINTS.BASE,
    [validateRequest.query(roleSchemas.rolepagination)],
    asyncHandler(roleHanders.fetchAllRoles)
);
