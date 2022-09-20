import mongoose from "mongoose";
import { userSchema, roleSchema, persistence } from "../common/dbSchema.js";

export const UserModel = mongoose.model("User", userSchema);
export const UseRole = mongoose.model("Role", roleSchema);
export const Persistence = mongoose.model("Persistence", persistence);
