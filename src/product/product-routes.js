import { Router } from "express";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
} from "./product-handlers.js";
import { productSchema } from "./../common/validationSchemas.js";
import { uploadFile } from "../common/utilies.js";
import { validate } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .post(
    "/",
    [
      uploadFile.single("image"),
      validate.imageExists,
      validate.requestBody(productSchema),
    ],
    add
  )
  .delete("/:id", validate.requestParams, remove)
  .put(
    "/put/:id",
    [
      validate.requestParams,
      uploadFile.single("image"),
      validate.imageExists,
      validate.requestBody(productSchema),
    ],
    update
  )
  .get("/single/:id", validate.requestParams, selectProduct)
  .get("/all", select);
