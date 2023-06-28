import { Router } from "express";
import { ENDPOINTS } from "../common/constants";
import { auctionRouter } from "../modules/auction/auction-routes";
import { userRoutes } from "../modules/users/user-routes";
import { roleRoutes } from "../modules/roles/role-routes";

/**
 * Index Routes
 * @description versioning of the router to set-up for modules
 */
export const v1Router = Router();
v1Router.use(ENDPOINTS.ROLE, roleRoutes)
v1Router.use(ENDPOINTS.USERS, userRoutes)
v1Router.use(ENDPOINTS.AUCTIONS, auctionRouter);