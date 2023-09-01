import { Response, Request } from "express";
import referralService from "./referral-services";
import { ReferralConfig } from "./typings/referral.type";

/**
 * @description referralConfig give details set for referral logic
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const referralConfig = async (_req: Request, res: Response) => {
    const response = await referralService.referralConfig();
    res.status(response.code).json(response);
};

/**
 * @description updateReferralConfig is used to update configuration for referral code.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const updateReferralConfig = async (req: Request, res: Response) => {
    const response = await referralService.updateReferralConfig(req.body as ReferralConfig);
    res.status(response.code).json(response);
};

/**
 * @description getReferral is used to give details of referral and its details
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getReferral = async (req: Request, res: Response) => {
    const response = await referralService.getReferral(req.params.id as string);
    res.status(response.code).json(response);
};

const referralHandler = {
    getReferral,
    referralConfig,
    updateReferralConfig,
};
export default referralHandler;
