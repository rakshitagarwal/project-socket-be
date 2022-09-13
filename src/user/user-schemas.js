import mongoose from "mongoose";
import { userSchema } from "../models/schemas.js";

export const UserModel = mongoose.model("User", userSchema);