import { Router } from "express";
import { PRODUCT_PATHNAME,USER_PATHNAME} from "./common/constants.js";
import { productRouter } from "./product/product-routes.js";
import { userRouter } from "./user/user-routes.js";

export const v1Router = Router();

v1Router.use(PRODUCT_PATHNAME, productRouter);

v1Router.use(USER_PATHNAME, userRouter);