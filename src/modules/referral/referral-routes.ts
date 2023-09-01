import { Router } from "express";
import referralHandler from "./referral-handlers";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import referralSchema from "./referral-schemas";
import handleAsync from "express-async-handler";
export const referralRouter = Router();

referralRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.REFERRAL_CONFIG,
    handleAsync(referralHandler.referralConfig)
);

referralRouter.patch(
    ENDPOINTS.BASE + ENDPOINTS.REFERRAL_CONFIG,
    validateRequest.body(referralSchema.requestBodySchema),
    handleAsync(referralHandler.updateReferralConfig)
);

referralRouter.get(
    ENDPOINTS.BASE + "/:id",
    validateRequest.params(referralSchema.uuidSchema),
    handleAsync(referralHandler.getReferral)
);
