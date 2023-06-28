import { Router } from "express";
import { ENDPOINTS } from "../common/constants";
import { auctionRouter } from "../modules/auction/auction-routes";
import { userRouter } from "../modules/users/user-routes";
import { roleRouter } from "../modules/roles/role-routes";

/**
 * Index Routes
 * @description versioning of the router to set-up for modules
 */
export const v1Router = Router();
v1Router.use(ENDPOINTS.ROLE, roleRouter)
v1Router.use(ENDPOINTS.USERS, userRouter)
v1Router.use(ENDPOINTS.AUCTIONS, auctionRouter);
