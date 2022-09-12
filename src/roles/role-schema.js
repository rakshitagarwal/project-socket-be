import mongoose from "mongoose";
import { model } from "../models/schemas.js";

const roleSchema = mongoose.model("Role", model.roleSchema);
const privilageSchema = mongoose.model("Privilage", model.privilageSchema);
const rolePrivilage = mongoose.model("RolePrivilage", model.rolePrivilage);

export const authSchemas = {
  roleSchema,
  privilageSchema,
  rolePrivilage,
};
