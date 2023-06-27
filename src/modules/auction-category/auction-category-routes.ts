import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import { auctionCategorySchemas } from "./auction-category-schemas";
import { auctionCategoryHandler } from "./auction-category-handlers";
import handleAsync from "express-async-handler";

export const auctionCategoryRouter = Router();

auctionCategoryRouter.post(
    ENDPOINTS.BASE,
    validateRequest.body(auctionCategorySchemas.ZAuctionCategory),
    handleAsync(auctionCategoryHandler.add)
);

auctionCategoryRouter.put(
    ENDPOINTS.BASE + ":id",
    validateRequest.params(auctionCategorySchemas.ZVerifyUUID),
    validateRequest.body(auctionCategorySchemas.ZPutAuctionCategory),
    handleAsync(auctionCategoryHandler.update)
);

auctionCategoryRouter.get(
    ENDPOINTS.BASE + ":id?",
    validateRequest.params(auctionCategorySchemas.ZVerifyUUID),
    handleAsync(auctionCategoryHandler.get)
);

auctionCategoryRouter.get(
    ENDPOINTS.BASE,
    handleAsync(auctionCategoryHandler.getAll)
);

auctionCategoryRouter.delete(
    ENDPOINTS.BASE + ":id",
    validateRequest.body(auctionCategorySchemas.ZDelete),
    handleAsync(auctionCategoryHandler.removeCategories)
);
