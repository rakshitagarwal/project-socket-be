import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import { auctionCategorySchemas } from "./auction-category-schemas";
import { auctionCategooryHandler } from "./auction-category-handlers";
import handleAsync from "express-async-handler";

export const auctionCategoryRouter = Router();

auctionCategoryRouter.post(
    ENDPOINTS.BASE,
    validateRequest.body(auctionCategorySchemas.IAuctionCategory),
    handleAsync(auctionCategooryHandler.add)
);

auctionCategoryRouter.put(
    ENDPOINTS.BASE + ":id",
    validateRequest.params(auctionCategorySchemas.IVerifyUUID),
    validateRequest.body(auctionCategorySchemas.IPutAuctionCategory),
    handleAsync(auctionCategooryHandler.update)
);
