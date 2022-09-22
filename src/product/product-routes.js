import { Router } from "express";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
  selectCategories,
} from "./product-handlers.js";
import {
  idSchema,
  paginationSchema,
  productSchema,
} from "./../common/validationSchemas.js";
import { validateSchema } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .get("/category/", selectCategories)
  .post("/", [validateSchema.body(productSchema)], add)
  .delete("/:id", validateSchema.params(idSchema), remove)
  .put(
    "/:id",
    [validateSchema.params(idSchema), validateSchema.body(productSchema)],
    update
  )
  .get("/:id", validateSchema.params(idSchema), selectProduct)
  .get("/", validateSchema.query(paginationSchema), select);
