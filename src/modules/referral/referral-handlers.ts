import { Response, Request } from "express";
import referralService from "./referral-services";

/**
 * Referral retrieve By Id
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const getReferral = async (req: Request, res: Response) => {
    const response = await referralService.getReferral(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * Referral update By Id and update
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const updateReferral = async (req: Request, res: Response) => {
    const response = await referralService.updateReferral(req.params.id as string);
    res.status(response.code).json(response);
};


/**
 * Referral Config update By Id and update
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const updateReferralConfig = async (req: Request, res: Response) => {
    const response = await referralService.updateReferralConfig(req.body as { reward_plays: number, credit_plays: number });
    res.status(response.code).json(response);
};

const referralHandler = {
    getReferral,
    updateReferral,
    updateReferralConfig,
};
export default referralHandler;
