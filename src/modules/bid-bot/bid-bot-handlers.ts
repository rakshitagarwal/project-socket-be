import { Response, Request } from "express";
import bidBotService from "./bid-bot-services";
import {IBidBotInfo, IUpdate} from "./typings/bid-bot-types";

const addbidBot = async (req: Request, res: Response) => {
    const response = await bidBotService.addbidBot(req.body as unknown as IBidBotInfo);
    res.status(response.code).json(response);
};

const getBidBotByPlayerId = async (req: Request, res: Response) => {
    const response = await bidBotService.getBidBotByPlayerId(req.params.id as unknown as string);
    res.status(response.code).json(response);
};

const getBidBotByAuctionId = async (req: Request, res: Response) => {    
    const response = await bidBotService.getBidBotByAuctionId(req.params.id as unknown as string);
    res.status(response.code).json(response);
};

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
