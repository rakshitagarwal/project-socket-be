import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import bidbotHandler from "./bid-bot-handlers";
import handleAsync from "express-async-handler";
import validateRequest from "../../middlewares/validateRequest";
import { bidbotSchemas } from "./bid-bot-schemas";

export const bidBotRouter = Router();

bidBotRouter.get(
    ENDPOINTS.BASE,
    validateRequest.query(bidbotSchemas.ZSearch),
    handleAsync(bidbotHandler.getBidBotByAuctionAndPlayerId)
);
// bidBotRouter.get(
//     ENDPOINTS.BASE + "auction/:id",
//     handleAsync(bidbotHandler.getBidBotByAuctionId)
// );
// bidBotRouter.get(
//     ENDPOINTS.BASE + "player/:id",
//     handleAsync(bidbotHandler.getBidBotByPlayerId)
// );
