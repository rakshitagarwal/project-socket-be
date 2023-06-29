import asyncHandler from "express-async-handler";
import { ENDPOINTS } from "../../common/constants";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import userSchemas from "./user-schemas";
import userHandlers from "./user-handlers";
import isAuthenticated from "../../middlewares/authentication";

export const userRouter: Router = Router();

userRouter.post(
    ENDPOINTS.REGISTER,
    [validateRequest.body(userSchemas.register)],
    asyncHandler(userHandlers.register)
);
userRouter.patch(
    ENDPOINTS.VERIFY,
    [validateRequest.body(userSchemas.emailVerifcation)],
    asyncHandler(userHandlers.otpVerification)
);
userRouter.post(
    ENDPOINTS.ADMIN_LOGIN,
    [validateRequest.body(userSchemas.adminLogin)],
    asyncHandler(userHandlers.adminLogin)
);
userRouter.post(
    ENDPOINTS.LOGIN,
    [validateRequest.body(userSchemas.login)],
    asyncHandler(userHandlers.playerLogin)
);
userRouter.put(
    ENDPOINTS.LOGOUT,
    [isAuthenticated],
    asyncHandler(userHandlers.logout)
);
userRouter.get(
    ENDPOINTS.REFRESH_TOKEN,
    [validateRequest.body(userSchemas.refreshToken), isAuthenticated],
    asyncHandler(userHandlers.refreshToken)
);
userRouter.get(
    ENDPOINTS.ID,
    [isAuthenticated, validateRequest.params(userSchemas.userId)],
    asyncHandler(userHandlers.getUserDetail)
);
userRouter.put(
    ENDPOINTS.ID,
    [
        isAuthenticated,
        validateRequest.params(userSchemas.userId),
        validateRequest.body(userSchemas.updateUser),
    ],
    asyncHandler(userHandlers.updateUser)
);

userRouter.delete(
    ENDPOINTS.ID,
    [isAuthenticated, validateRequest.params(userSchemas.userId)],
    asyncHandler(userHandlers.removeUser)
);

userRouter.put(
    ENDPOINTS.FORGET_PASSWORD,
    [validateRequest.body(userSchemas.login)],
    asyncHandler(userHandlers.forgetPassword)
);

userRouter.patch(
    ENDPOINTS.UPDATE_PASSWORD,
    [validateRequest.body(userSchemas.updatePassword)],
    asyncHandler(userHandlers.updatePassword)
);
userRouter.put(
    ENDPOINTS.RESET_PASSWORD,
    [isAuthenticated, validateRequest.body(userSchemas.resetPassword)],
    asyncHandler(userHandlers.resetPassword)
);

userRouter.get(
    ENDPOINTS.BASE,
    [isAuthenticated, validateRequest.query(userSchemas.pagination)],
    userHandlers.getAllusers
);
