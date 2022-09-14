import mongoose from "mongoose";
import { userSchema,roleSchema } from "../common/dbSchema.js";

export const UserModel = mongoose.model("User", userSchema);
export const UseRole = mongoose.model("Role", roleSchema);
