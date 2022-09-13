import { Router } from "express";
import { PRODUCT_PREFIX } from "../common/constants.js";
import { add, update } from "./product-handlers.js";
import { uploadFile } from "../common/utilies.js";
import { checkImageExists } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .post(PRODUCT_PREFIX, [uploadFile.single("image"), checkImageExists], add)
  .put(PRODUCT_PREFIX, update);
