import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import logger from "../config/logger.js";

connectDB();
const rolesSchema = async () => {
  await authSchemas.roleSchema.deleteMany({});
  const data = await authSchemas.roleSchema.insertMany(helpers.roles);
  if (data.length > 0) {
    logger.info({
      type: "info",
      message: "Roles Added",
    });
  }
};

const privilageSchema = async () => {
  await authSchemas.privilageSchema.deleteMany({});
  const privilageData = await authSchemas.privilageSchema.insertMany(
    helpers.privilage
  );
  if (privilageData > 0) {
    logger.info({
      type: "info",
      message: "Prvilage add",
    });
  }
};
const privilage = async () => {
  try {
    const data = helpers.privilageRole;
    let element = "";
    for (let index = 0; index < data.length; index++) {
      element = data[index];
    }
    await authSchemas.rolePrivilage.deleteMany({});
    const PrvilageRole = await authSchemas.rolePrivilage.insertMany(element);
    if (PrvilageRole > 0) {
      logger.info({
        type: "info",
        message: "Privilage checked in Role",
      });
    }
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

rolesSchema();
privilageSchema();
privilage();
