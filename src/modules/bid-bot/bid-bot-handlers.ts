import { Response, Request } from "express";
import bidBotService from "./bid-bot-services";
import { IFindBidBot } from "./typings/bid-bot-types";

/**
 * @description Get bidbot using auction id and player id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getBidBotByAuctionAndPlayerId = async (req: Request, res: Response) => {
    const response = await bidBotService.getBidBotByAuctionAndPlayerId(req.query as unknown as IFindBidBot)
    res.status(response.code).json(response)
}

/**
 * @description Get bidbot using auction id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getBidBotByAuctionId = async (req: Request, res: Response) => {    
    const response = await bidBotService.getBidBotByAuctionId(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * @description Get bidbot using player id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getBidBotByPlayerId = async (req: Request, res: Response) => {
    const response = await bidBotService.getBidBotByPlayerId(req.params.id as string);
    res.status(response.code).json(response);
};

const bidbotHandler = {
    getBidBotByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
};
export default bidbotHandler;
