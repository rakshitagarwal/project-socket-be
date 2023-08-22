import { Router } from "express";
import referralHandler from "./referral-handlers";
// import { ENDPOINTS } from "../../common/constants";
import handleAsync from "express-async-handler";
import isAuthenticated from "../../middlewares/authentication";
export const referralRouter = Router();

referralRouter.get("get", handleAsync(referralHandler.getReferral));
referralRouter.put("put", isAuthenticated, handleAsync(referralHandler.updateReferral));
referralRouter.put("put", isAuthenticated, handleAsync(referralHandler.updateReferralConfig));