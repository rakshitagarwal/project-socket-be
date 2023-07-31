import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import handleAsync from "express-async-handler";
import { auctionHandler } from "./auction-handlers";

export const auctionRouter = Router();

auctionRouter.post(
    ENDPOINTS.BASE,
    validateRequest.body(auctionSchemas.ZAuctionAdd),
    handleAsync(auctionHandler.create)
);

auctionRouter.get(
    ENDPOINTS.BASE + ":id",
    validateRequest.params(auctionSchemas.ZAuctionId),
    handleAsync(auctionHandler.getById)
);

auctionRouter.get(
    ENDPOINTS.BASE,
    [validateRequest.query(auctionSchemas.Zpagination)],
    handleAsync(auctionHandler.getAll)
);

auctionRouter.put(
    ENDPOINTS.BASE + ":id",
    validateRequest.params(auctionSchemas.ZAuctionId),
    handleAsync(auctionHandler.update)
);

auctionRouter.delete(
    ENDPOINTS.BASE,
    validateRequest.body(auctionSchemas.ZDeleteId),
    handleAsync(auctionHandler.remove)
);

auctionRouter.get(
    ENDPOINTS.BASE + "logs/:id",
    validateRequest.params(auctionSchemas.ZAuctionId),
    handleAsync(auctionHandler.getBidLogs)
);

auctionRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.PLAYER_AUCTION_REGISTER,
    [validateRequest.body(auctionSchemas.ZPlayerRegister)],
    handleAsync(auctionHandler.playerAuctionRegister)
);

auctionRouter.get(
    ENDPOINTS.PLAYER_AUCTION_ID,
    [validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.getAllMyAuction)
);