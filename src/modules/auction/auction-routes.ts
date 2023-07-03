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
    validateRequest.params(auctionSchemas.uuidSchema),
    handleAsync(auctionHandler.getById)
);

auctionRouter.get(
    ENDPOINTS.BASE,
    handleAsync(auctionHandler.getAll)
);
