import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import logger from "../config/logger.js";
import { productRoleSchema } from "../roles/product-schema.js";
import { userSchemas } from "../roles/user-schema.js";
import cr from "crypto-js";
import { auctionRole } from "../roles/auction-schema.js";
import { walletRole } from "../roles/wallet-schema.js";
(async () => {
  connectDB();
  const userSchema = async () => {
    const adminRoleId = await authSchemas.roleSchema
      .findOne({ name: "Admin" })
      .select({ _id: 1 });
    const userInfo = helpers.userSchema[0];
    await userSchemas.userSchema.deleteMany({});
    const hashDigest = cr.SHA256("rishi@123").toString();
    const data = await userSchemas.userSchema.insertMany({
      fullName: userInfo.fullName,
      email: userInfo.email,
      password: hashDigest,
      Role: adminRoleId,
    });
  };
  const userProfile = async () => {
    const userRoleId = await userSchemas.userSchema
      .findOne({ fullName: "Rishi" })
      .select({ _id: 1 });
    const userData = helpers.userProfile[0];
    const bod = "01/12/2022";
    await userSchemas.userProfile.deleteMany({});
    const data = await userSchemas.userProfile.insertMany({
      location: userData.location,
      address: userData.address,
      dateOfBirth: bod,
      avatar: userData.avatar,
      gender: userData.gender,
      User: userRoleId,
    });
  };

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

      const vandorData = helpers.privilageRole;
      const adminData = helpers.privilageRoleVan;
      await authSchemas.rolePrivilage.deleteMany({});
      const PrvilageRoleAdmin = await authSchemas.rolePrivilage.insertMany({
        role: adminRoleId,
        module: vandorData[0].module,
      });
      const PrvilageRoleVandor = await authSchemas.rolePrivilage.insertMany({
        role: vendorRoleId,
        module: adminData[0].module,
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
    const auctionCategory = await auctionRole.auctionCategory.insertMany(
      helpers.auctionCategory
    );
    if (auctionCategory.length > 0) {
      logger.info({
        type: "info",
        message: "Auction Category add",
      });
    }
  };
  const productCategorySchema = async () => {
    await productRoleSchema.productCategory.deleteMany({});
    const productCategory = await productRoleSchema.productCategory.insertMany(
      helpers.productCategory
    );
    if (productCategory.length > 0) {
      logger.info({
        type: "info",
        message: "Product Category add",
      });
    }
  };
  const productSchema = async () => {
    const productsDataId = await productRoleSchema.productCategory
      .findOne({ name: "mobile" })
      .select({ _id: 1 });
    const productSchema = helpers.productSchema[0];
    const ProductData = await productRoleSchema.productSchema.insertMany({
      ProductCategory: productsDataId,
      title: productSchema.title,
      description: productSchema.description,
      image: productSchema.image,
      purchasePrice: productSchema.purchasePrice,
      sellingPrice: productSchema.sellingPrice,
      overHeadCost: productSchema.overHeadCost,
      quantity: productSchema.quantity,
    });
    if (ProductData.length > 0) {
      logger.info({
        type: "info",
        message: "Product schema add",
      });
    }
  };

  const auctionSchema = async () => {
    const productId = await productRoleSchema.productSchema
      .findOne({ title: "apple 14" })
      .select({ _id: 1 });
    const auctionId = await auctionRole.auctionCategory
      .findOne({ name: "Apple" })
      .select({ _id: 1 });
    const auctionData = helpers.auctionSchema[0];
    const startDate = new Date().getTime();
    const endDate = new Date().getTime() + 60;

    await auctionRole.auctionSchema.deleteMany({});
    const AuctionDataSchema = await auctionRole.auctionSchema.insertMany({
      title: auctionData.title,
      bannerImage: auctionData.bannerImage,
      bannerVideo: auctionData.bannerVideo,
      noOfPlayConsumed: auctionData.noOfPlayConsumed,
      bidIncrement: auctionData.bidIncrement,
      OpeningPrice: auctionData.OpeningPrice,
      startTime: startDate,
      endTime: endDate,
      quantity: auctionData.quantity,
      noNewBidderLimit: auctionData.noNewBidderLimit,
      Product: productId,
      AuctionCategory: auctionId,
    });
    if (AuctionDataSchema.length > 0) {
      logger.info({
        type: "info",
        message: "Auction schema add",
      });
    }
  };
  const auctionPreRegisterSchema = async () => {
    const auctionPreId = await auctionRole.auctionSchema
      .findOne({
        title: "Mobile Auction",
      })
      .select({ _id: 1 });
    const date = new Date();
    const auctionPreData = helpers.auctionPreRegisterSchema[0];
    const AuctionDataSchema = await auctionRole.auctionPreRegister.insertMany({
      startDate: date,
      participantCount: auctionPreData.participantCount,
      participantFees: auctionPreData.participantFees,
      Auction: auctionPreId,
    });
    if (AuctionDataSchema.length > 0) {
      logger.info({
        type: "info",
        message: "Auction premium register schema add",
      });
    }
  };
  const auctionResultSchema = async () => {
    const acutionResult = helpers.auctionResultSchema[0];
    const userRoleId = await userSchemas.userSchema
      .findOne({ fullName: "Rishi" })
      .select({ _id: 1 });
    const acData = await auctionRole.auctionSchema
      .findOne({ title: "Mobile Auction" })
      .select({ _id: 1 });
    await auctionRole.auctionResultSchema.insertMany({
      noOfTimePreRegistered: acutionResult.noOfTimePreRegistered,
      noOfTimeAuctionNotPlayed: acutionResult.noOfTimeAuctionNotPlayed,
      noOfAuctionPlayed: acutionResult.noOfAuctionPlayed,
      noOfTimePostRegistered: acutionResult.noOfTimePostRegistered,
      User: userRoleId,
      Auction: acData,
    });
  };
  const walletSchema = async () => {
    const acutionResult = helpers.walletSchema[0];
    const userRoleId = await userSchemas.userSchema
      .findOne({ fullName: "Rishi" })
      .select({ _id: 1 });
    await walletRole.walletSchema.insertMany({
      name: acutionResult.name,
      walletBalance: acutionResult.walletBalance,
      walletAddress: acutionResult.walletAddress,
      networkType: acutionResult.networkType,
      chainID: acutionResult.chainID,
      User: userRoleId,
    });
  };
  const transactionSchema = async () => {
    const transData = 100;
    const userRoleId = await userSchemas.userSchema
      .findOne({ fullName: "Rishi" })
      .select({ _id: 1 });
    const walletId = await walletRole.walletSchema
      .findOne({ name: "johan" })
      .select({ _id: 1 });

    await walletRole.transactionSchema.insertMany({
      playConsumend: transData,
      User: userRoleId,
      Wallet: walletId,
    });
    process.exit();
  };

  await rolesSchema();
  privilageSchema();
  privilage();
  userSchema();
  userProfile();
  productCategorySchema();
  auctionCategorySchema();
  productSchema();
  auctionSchema();

  auctionPreRegisterSchema();
  auctionResultSchema();
  transactionSchema();
  walletSchema();
})();
