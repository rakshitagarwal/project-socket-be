import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const userSchema = mongoose.model("User", model.userSchema);
const userProfile= mongoose.model("UserProfile",model.userProfile)
export const userSchemas = {
  userSchema,
  userProfile
};
