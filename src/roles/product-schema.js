import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const productCategory = mongoose.model(
  "ProductCategory",
  model.productCategory
);
const productSchema = mongoose.model("Product", model.productSchema);

export const productRoleSchema = {
  productCategory,
  productSchema,
};
