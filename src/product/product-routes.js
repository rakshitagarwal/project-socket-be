import { Router } from "express";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
  selectCategories,
  searchProduct,
} from "./product-handlers.js";
import {
  idSchema,
  paginationSchema,
  productSchema,
  searchSchema,
  updateProductSchema,
} from "./../common/validationSchemas.js";
import { validateSchema } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .get("/category/", selectCategories)
  .get("/search/", validateSchema.query(searchSchema), searchProduct)
  .post("/", [validateSchema.body(productSchema)], add)
  .delete(
    "/:id",
    [validateSchema.objectId, validateSchema.params(idSchema)],
    remove
  )
  .put(
    "/:id",
    [
      validateSchema.objectId,
      validateSchema.params(idSchema),
      validateSchema.body(updateProductSchema),
    ],
    update
  )
  .get(
    "/:id",
    [validateSchema.objectId, validateSchema.params(idSchema)],
    selectProduct
  )
  .get("/", validateSchema.query(paginationSchema), select);
