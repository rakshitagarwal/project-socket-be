import mongoose from "mongoose";
import { userSchema } from "../common/dbSchema.js";

export const UserModel = mongoose.model("User", userSchema);