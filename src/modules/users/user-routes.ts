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
    ENDPOINTS.RESET_PASSWORD,
    [isAuthenticated, validateRequest.body(userSchemas.resetPassword)],
    asyncHandler(userHandlers.resetPassword)
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

userRouter.post(
    ENDPOINTS.FORGET_PASSWORD,
    [validateRequest.body(userSchemas.login)],
    asyncHandler(userHandlers.forgetPassword)
);

userRouter.patch(
    ENDPOINTS.UPDATE_PASSWORD,
    [validateRequest.body(userSchemas.updatePassword)],
    asyncHandler(userHandlers.updatePassword)
);

userRouter.get(
    ENDPOINTS.BASE,
    [isAuthenticated, validateRequest.query(userSchemas.pagination)],
    asyncHandler(userHandlers.getAllusers)
);

userRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.BALANCE,
    [isAuthenticated, validateRequest.params(userSchemas.ZPlayerId)],
    asyncHandler(userHandlers.getPlayBalance)
);

userRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.ADD_PLAYS,
    [isAuthenticated, validateRequest.body(userSchemas.ZPlayerBalance)],
    asyncHandler(userHandlers.addPlaysInWallet)
);

userRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.DEDUCT_PLAYS,
    [isAuthenticated, validateRequest.body(userSchemas.ZDeductPlays)],
    asyncHandler(userHandlers.deductPlays)
);

userRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.TRANSFER_PLAYS,
    [isAuthenticated, validateRequest.body(userSchemas.ZPlayerEmail)],
    asyncHandler(userHandlers.verifyUserDetails)
);

userRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.TRANSFER_PLAYS,
    [isAuthenticated, validateRequest.body(userSchemas.ZTransferPlays)],
    asyncHandler(userHandlers.transferPlays)
);

userRouter.post(
    ENDPOINTS.RESEND_OTP,
    validateRequest.body(userSchemas.resendOtp),
    asyncHandler(userHandlers.resendOtpToUser)
);

userRouter.patch(
    ENDPOINTS.BASE + ENDPOINTS.USER_BLOCK,
    [isAuthenticated, validateRequest.params(userSchemas.ZPlayerId), validateRequest.body(userSchemas.updateUserBlock)],
    asyncHandler(userHandlers.userBlockStatus)
);
