import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import logger from "../config/logger.js";

const roles = async () => {
  connectDB();
  await authSchemas.roleSchema.deleteMany({});
  const data = await authSchemas.roleSchema.insertMany(helpers.roles);
  if (data.length > 0) {
    logger.info({
      type: "info",
      message: "Roles Added",
    });
    process.exit();
  }
};

roles();
