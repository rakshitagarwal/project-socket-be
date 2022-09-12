import mongoose from "mongoose";
import { productSchema } from "../models/schemas.js";

export const productModel = mongoose.model("Product", productSchema);
