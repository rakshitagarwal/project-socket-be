import { Router } from "express";
import { ID_POSTFIX } from "../common/constants.js";
import { add, remove, fetchProduct } from "./product-handlers.js";
import { uploadFile } from "../common/utilies.js";
import { checkImageExists } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .post("/", [uploadFile.single("image"), checkImageExists], add)
  .delete("/", remove);
