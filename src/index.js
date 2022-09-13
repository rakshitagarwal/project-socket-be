import { Router } from "express";
import { PRODUCT_PREFIX } from "./common/constants.js";
import { productRouter } from "./product/product-routes.js";

export const v1Router = Router();

v1Router.use(PRODUCT_PREFIX, productRouter);
