import { Response, Request } from "express";
import bidBotService from "./bid-bot-services";
import { IBidBotData, ISearch } from "./typings/bid-bot-types";

/**
 * @description Add bidbot handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const addBidBot = async (req: Request, res: Response) => {
    const response = await bidBotService.addBidBot(req.body as IBidBotData);
    res.status(200).json(response);
};

/**
 * @description Get bidbot using auction id and player id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getByAuctionAndPlayerId = async (req: Request, res: Response) => {
    const response = await bidBotService.getByAuctionAndPlayerId(req.query as unknown as ISearch)
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

/**
 * @description Update bidlimit of a specific bidbot using id and limit data.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const updateBidBot = async (req: Request, res: Response) => {    
    const response = await bidBotService.updateBidBot(req.body as ISearch);
    res.status(response.code).json(response);
};

const bidbotHandler = {
    addBidBot,
    getByAuctionAndPlayerId,
    getBidBotByAuctionId,
    getBidBotByPlayerId,
    updateBidBot,
};
export default bidbotHandler;
