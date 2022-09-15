import { Router } from "express";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
} from "./product-handlers.js";
import {
  paginationSchema,
  productSchema,
} from "./../common/validationSchemas.js";
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
    "/:id",
    [
      validate.requestParams,
      uploadFile.single("image"),
      validate.imageExists,
      validate.requestBody(productSchema),
    ],
    update
  )
  .get("/:id", validate.requestParams, selectProduct)
  .get("/", validate.requestQueryParams(paginationSchema), select);
