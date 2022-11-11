import { Router } from "express";
import {
  AUCTION_PATHNAME,
  PRODUCT_PATHNAME,
  UPLOAD_PATHNAME,
  USER_PATHNAME,
  SEARCH_PATHNAME,
  SETTING_PATHNAME,
  TRACK,
} from "./common/constants.js";
import { productRouter } from "./product/product-routes.js";
import { userRouter } from "./user/user-routes.js";
import { uploadRouter } from "./upload/upload-routes.js";
import { auctionRouter } from "./auction/auction-routes.js";
import { settingRouter } from "./setting/setting-routes.js";
import { locationRouter } from "./location/location-routes.js";
import { checkAccess } from "./middleware/acl.js";
import { isAuthenticated } from "./middleware/auth.js";
export const v1Router = Router();

v1Router.use(PRODUCT_PATHNAME, [isAuthenticated, checkAccess], productRouter);
v1Router.use(UPLOAD_PATHNAME, [isAuthenticated, checkAccess], uploadRouter);
v1Router.use(USER_PATHNAME, userRouter);
v1Router.use(AUCTION_PATHNAME, [isAuthenticated, checkAccess], auctionRouter);
v1Router.use(SETTING_PATHNAME, settingRouter);
v1Router.use(TRACK, locationRouter);
