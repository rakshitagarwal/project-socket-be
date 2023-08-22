import { Response, Request } from "express";
import referralService from "./referral-services";
import { ReferralData } from "./typings/referral.type";

const addReferral = async (req: Request, res: Response) => {
    const response = await referralService.addReferral(req.body as unknown as ReferralData)
    res.status(response.code).json(response)
}

const getReferral = async (req: Request, res: Response) => {    
    const response = await referralService.getReferral(req.params.id as string);
    res.status(response.code).json(response);
};

const updateReferral = async (req: Request, res: Response) => {    
    const response = await referralService.updateReferral(req.params.id as string);
    res.status(response.code).json(response);
};

const updateReferralConfig = async (req: Request, res: Response) => {
    const response = await referralService.updateReferralConfig(req.body as {reward_plays: number, credit_plays: number});
    res.status(response.code).json(response);
};

const referralHandler = {
    addReferral,
    getReferral,
    updateReferral,
    updateReferralConfig,
};
export default referralHandler;
