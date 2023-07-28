import { Response, Request } from "express";
import bidBotService from "./bid-bot-services";
import {IBidBotInfo, IUpdate} from "./typings/bid-bot-types";

/**
 * @description Add bidbot handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const addbidBot = async (req: Request, res: Response) => {
    const response = await bidBotService.addbidBot(req.body as unknown as IBidBotInfo);
    res.status(response.code).json(response);
};

/**
 * @description Get bidbot using player id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getBidBotByPlayerId = async (req: Request, res: Response) => {
    const response = await bidBotService.getBidBotByPlayerId(req.params.id as unknown as string);
    res.status(response.code).json(response);
};

/**
 * @description Get bidbot using auction id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getBidBotByAuctionId = async (req: Request, res: Response) => {    
    const response = await bidBotService.getBidBotByAuctionId(req.params.id as unknown as string);
    res.status(response.code).json(response);
};

/**
 * @description Update bidlimit of a specific bidbot using id and limit data.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const updateBidBot = async (req: Request, res: Response) => {    
    const response = await bidBotService.updateBidBot(req.params.id as unknown as string, req.body as unknown as IUpdate);
    res.status(response.code).json(response);
};

const bidbotHandler = {
    addbidBot,
    getBidBotByPlayerId,
    getBidBotByAuctionId,
    updateBidBot,
};
export default bidbotHandler;
