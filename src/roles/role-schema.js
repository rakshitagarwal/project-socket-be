import mongoose from "mongoose";
import { model } from "../models/schemas.js";
import logger from "../config/logger.js";

let roleSchema, privilageSchema, rolePrivilage;

try {
  roleSchema = mongoose.model("Role", model.roleSchema);
  privilageSchema = mongoose.model("Privilage", model.privilageSchema);
  rolePrivilage = mongoose.model("RolePrivilage", model.rolePrivilage);
} catch (error) {
  logger.error(error);
}

export const authSchemas = {
  roleSchema,
  privilageSchema,
  rolePrivilage,
};
