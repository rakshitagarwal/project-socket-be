import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import logger from "../config/logger.js";
import { auctionRole } from "../auction/auction-schemas.js";
import { productCategoryModel } from "../product/product-schemas.js";
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
      const adminRoleId = await authSchemas.roleSchema
        .findOne({ name: "Admin" })
        .select({ _id: 1 });
      const vendorRoleId = await authSchemas.roleSchema
        .findOne({ name: "Vendor" })
        .select({ _id: 1 });
      const plyRoleId = await authSchemas.roleSchema
        .findOne({ name: "Player" })
        .select({ _id: 1 });

      const vandorData = helpers.privilageRole;
      const adminData = helpers.privilageRoleVan;
      const ply = helpers.privilageRolePlayer;

      await authSchemas.rolePrivilage.deleteMany({});
      const PrvilageRoleAdmin = await authSchemas.rolePrivilage.insertMany({
        role: adminRoleId,
        module: vandorData[0].module,
      });
      const PrvilageRoleVandor = await authSchemas.rolePrivilage.insertMany({
        role: vendorRoleId,
        module: adminData[0].module,
      });
      await authSchemas.rolePrivilage.insertMany({
        role: plyRoleId,
        module: ply[0].module,
      });
      if (PrvilageRole.length > 0) {
        logger.info({
          type: "info",
          message: "Privilage checked in Role",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const auctionCategorySchema = async () => {
    await auctionRole.auctionCategory.deleteMany({});
    const auctionCategory = await auctionRole.auctionCategory.insertMany({
      name: "English",
      description: "This is an english acution",
    });

    if (auctionCategory.length > 0) {
      logger.info({
        type: "info",
        message: "Auction Category add",
      });
    }
  };

  const productCategorySchema = async () => {
    await productCategoryModel.deleteMany({});
    const productCategory = await productCategoryModel.insertMany(
      helpers.productCategory
    );
    if (productCategory.length > 0) {
      logger.info({
        type: "info",
        message: "Product Category add",
      });
    }
  };

  await rolesSchema();
  privilageSchema();
  privilage();
  productCategorySchema();
  auctionCategorySchema();
})();
