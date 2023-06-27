import { Router } from "express";
import { ENDPOINTS } from "../common/constants";
import { auctionRouter } from "../modules/auction/auction-routes";
import { auctionCategoryRouter } from "../modules/auction-category/auction-category-routes";

/**
 * Index Routes
 * @description versioning of the router to set-up for modules
 */
export const v1Router = Router();

v1Router.use(ENDPOINTS.AUCTIONS, auctionRouter);
v1Router.use(ENDPOINTS.AUCTION_CATEGORY, auctionCategoryRouter);
