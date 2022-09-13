import { Router } from "express";
import { PRODUCT_PATHNAME } from "../common/constants.js";
import { add } from "./product-handlers.js";

export const productRouter = Router();

productRouter.post(PRODUCT_PATHNAME, add);
