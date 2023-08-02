import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import bidbotHandler from "./bid-bot-handlers";

export const bidBotRouter = Router();

bidBotRouter.post(ENDPOINTS.BASE, bidbotHandler.addBidBot);
bidBotRouter.get(ENDPOINTS.BASE + "search/", bidbotHandler.getByAuctionAndPlayerId);
bidBotRouter.get(ENDPOINTS.BASE + "auction/:id", bidbotHandler.getBidBotByAuctionId);
bidBotRouter.get(ENDPOINTS.BASE + "player/:id", bidbotHandler.getBidBotByPlayerId);
bidBotRouter.patch(ENDPOINTS.BASE + "update", bidbotHandler.updateBidBot);
