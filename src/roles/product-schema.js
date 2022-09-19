import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const productCategory = mongoose.model(
  "ProductCategory",
  model.productCategory
);

export const productRoleSchema = {
  productCategory,
};
