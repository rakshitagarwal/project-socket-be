import { Router } from "express";
import referralHandler from "./referral-handlers";
// import { ENDPOINTS } from "../../common/constants";
import handleAsync from "express-async-handler";
export const referralRouter = Router();

referralRouter.get("get", handleAsync(referralHandler.getReferral));
referralRouter.put("put", handleAsync(referralHandler.updateReferral));
referralRouter.put("put", handleAsync(referralHandler.updateReferralConfig));