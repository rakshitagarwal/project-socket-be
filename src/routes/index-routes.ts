import { Router } from "express";
import { ENDPOINTS } from "../common/constants";
import { auctionRouter } from "../modules/auction/auction-routes";
import { productCategoryRoutes } from "../modules/product-categories/product-category-routes";
import { auctionCategoryRouter } from "../modules/auction-category/auction-category-routes";
import { userRouter } from "../modules/users/user-routes";
import { roleRouter } from "../modules/roles/role-routes";
import { productRoutes } from "../modules/product/product-routes";
import { termAndConditionRouter } from "../modules/term-conditions/term-condition-routes";
import isAuthenticated from "../middlewares/authentication";
import { mediaRouter } from "../modules/media/media-routes";
import { bidBotRouter } from "../modules/bid-bot/bid-bot-routes";
import { referralRouter } from "../modules/referral/referral-routes";
import { locationRouter } from "../modules/location/location-routes";
import { currencyRouter } from "../modules/currency/currency-routes";

/**
 * Index Routes
 * @description versioning of the router to set-up for modules
 */
export const v1Router = Router();
v1Router.use(ENDPOINTS.ROLE, roleRouter);
v1Router.use(ENDPOINTS.LOCATION, locationRouter);
v1Router.use(ENDPOINTS.USERS, userRouter);
v1Router.use(ENDPOINTS.AUCTIONS, [isAuthenticated], auctionRouter);
v1Router.use(
    ENDPOINTS.PRODUCT_CATEGORY,
    [isAuthenticated],
    productCategoryRoutes
);
v1Router.use(ENDPOINTS.PRODUCT, [isAuthenticated], productRoutes);
v1Router.use(ENDPOINTS.TERM_CONDITION, isAuthenticated, termAndConditionRouter);
v1Router.use(ENDPOINTS.MEDIA, isAuthenticated, mediaRouter);
v1Router.use(ENDPOINTS.BIDBOT, isAuthenticated, bidBotRouter);
v1Router.use(ENDPOINTS.REFERRAL, isAuthenticated, referralRouter);
v1Router.use(ENDPOINTS.CURRENCY, isAuthenticated, currencyRouter);

v1Router.use(
    ENDPOINTS.AUCTION_CATEGORY,
    [isAuthenticated],
    auctionCategoryRouter
);
