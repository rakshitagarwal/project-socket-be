import { Router } from "express";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
  selectCategory,
  selectCategories,
} from "./product-handlers.js";
import {
  idSchema,
  paginationSchema,
  productSchema,
} from "./../common/validationSchemas.js";
import { uploadFile } from "../common/utilies.js";
import { validateSchema } from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .post(
    "/",
    [
      uploadFile.single("image"),
      validateSchema.file,
      validateSchema.body(productSchema),
    ],
    add
  )
  .delete("/:id", validateSchema.params(idSchema), remove)
  .put(
    "/:id",
    [
      uploadFile.single("image"),
      validateSchema.file,
      validateSchema.params(idSchema),
      validateSchema.body(productSchema),
    ],
    update
  )
  .get("/:id", validateSchema.params(idSchema), selectProduct)
  .get("/", validateSchema.query(paginationSchema), select)
  .get("/catgeory", selectCategories)
  .get(
    "/category/:id",
    validateSchema.params(paginationSchema),
    selectCategory
  );
