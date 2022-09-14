import mongoose from "mongoose";
import { productSchema, productCategory } from "../common/dbSchema.js";

export const productModel = mongoose.model("Product", productSchema);
export const productCategoryModel = mongoose.model(
  "ProductCategory",
  productCategory
);
