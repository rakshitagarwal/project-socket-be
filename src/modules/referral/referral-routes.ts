import { Router } from "express";
import referralHandler from "./referral-handlers";
import { ENDPOINTS } from "../../common/constants";
import handleAsync from "express-async-handler";
export const referralRouter = Router();

referralRouter.get(ENDPOINTS.BASE, handleAsync(referralHandler.getReferral));
referralRouter.put(ENDPOINTS.BASE, handleAsync(referralHandler.updateReferral));
referralRouter.put(ENDPOINTS.BASE + ENDPOINTS.REFERRAL_CONFIG, handleAsync(referralHandler.updateReferralConfig));