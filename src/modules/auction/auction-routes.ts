import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";

export const auctionRouter = Router();

auctionRouter.post(ENDPOINTS.BASE);
