import { Router } from "express";
import { ENDPOINTS } from "../common/constants";
import { auctionRouter } from "../modules/auction/auction-routes";
import { productCategoryRoutes } from '../modules/product-categories/index.routes';
import { auctionCategoryRouter } from "../modules/auction-category/auction-category-routes";
import { userRoutes } from "../modules/users/user-routes";
import { roleRoutes } from "../modules/roles/role-routes";
import { productRoutes } from '../modules/product/index.routes';
import isAuthenticated from "../middlewares/authentication";

import isAuthenticated from '../middlewares/authentication';
/**
 * Index Routes
 * @description versioning of the router to set-up for modules
 */
export const v1Router = Router();
v1Router.use(ENDPOINTS.ROLE, roleRoutes);
v1Router.use(ENDPOINTS.USERS, userRoutes);
v1Router.use(ENDPOINTS.AUCTIONS, auctionRouter);
v1Router.use(ENDPOINTS.PRODUCT_CATEGORY, [isAuthenticated], productCategoryRoutes);
v1Router.use(ENDPOINTS.PRODUCT, [isAuthenticated], productRoutes);


v1Router.use(
    ENDPOINTS.AUCTION_CATEGORY,
    [isAuthenticated],
    auctionCategoryRouter
);
