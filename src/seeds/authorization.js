import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import logger from "../config/logger.js";

(async () => {
  connectDB();

  const rolesSchema = async () => {
    try {
      await authSchemas.roleSchema.deleteMany({});
      const data = await authSchemas.roleSchema.insertMany(helpers.roles);
      if (data.length > 0) {
        logger.info({
          type: "info",
          message: "Roles Added",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const privilageSchema = async (data) => {
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
      const adminRoleId = await authSchemas.roleSchema
        .findOne({ name: "Admin" })
        .select({ _id: 1 });
      const vendorRoleId = await authSchemas.roleSchema
        .findOne({ name: "Vendor" })
        .select({ _id: 1 });

      const data = helpers.privilageRole;
      const datas = helpers.privilageRoleVan;
      await authSchemas.rolePrivilage.deleteMany({});
      const PrvilageRoleAdmin = await authSchemas.rolePrivilage.insertMany({
        role: adminRoleId,
        module: data[0].module,
      });
      const PrvilageRoleVandor = await authSchemas.rolePrivilage.insertMany({
        role: vendorRoleId,
        module: datas[0].module,
      });
      if (PrvilageRole > 0) {
        logger.info({
          type: "info",
          message: "Privilage checked in Role",
        });
      }
      process.exit();
    } catch (error) {
      logger.error(error);
    }
  };

  await rolesSchema();
  privilageSchema();
  privilage();
})();
