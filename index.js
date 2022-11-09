import express from "express";
import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { helpers } from "./src/helper/helpers.js";
import cors from "cors";
import fs from "fs";
import { v1Router } from "./src/index.js";
import { createResponse } from "./src/common/utilies.js";
import env from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import logger from "./src/config/logger.js";
import { PREFIX_VERSION } from "./src/common/constants.js";
import cookieParser from "cookie-parser";
import i18n from "i18n";
import { authSchemas } from "./src/roles/role-schema.js";
import { productCategoryModel } from "./src/product/product-schemas.js";
import { auctionRole } from "./src/auction/auction-schemas.js";

export const app = express();
const PORT = env.PORT;
const LOG_ENV = env.LOG_ENV;
const HOST = env.HOST;
const STATIC_PATH = env.STATIC_PATH;

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(LOG_ENV));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use("/assets/uploads", express.static(env.FILE_STORAGE_PATH));

// language configurations
i18n.configure({
  locales: ["en", "fr", "nl"],
  directory: process.cwd() + STATIC_PATH,
  header: "accept-language",
  defaultLocale: "en",
});

// Main Routes
app.get("/", (req, res) => {
  res.json({ Welcome: "BiG Deal Server", docs: "/docs" });
});

// Version Routers
app.use(PREFIX_VERSION, i18n.init, v1Router);

app.use(
  "/docs",
  serve,
  setup(swaggerDoc, {
    swaggerOptions: { filter: "", persistAuthorization: true },
    customSiteTitle: "BigDeal Admin-Panel Swagger",
    explorer: true,
  })
);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  const { response, statusCode } = createResponse(
    helpers.StatusCodes.INTERNAL_SERVER_ERROR,
    err.message,
    {},
    {
      error: err.stack,
    }
  );
  res.status(statusCode).json(response);
});

app.use("*", (req, res) => {
  res.status(helpers.StatusCodes.NOT_FOUND).json({
    success: false,
    message: "route " + helpers.StatusMessages.NOT_FOUND,
    metadata: req["originalUrl"],
  });
});

// initial scripts for seeding the data
(async () => {
  connectDB();
  const roleCount = await authSchemas.roleSchema.countDocuments();
  const privilageCout = await authSchemas.privilageSchema.countDocuments();
  const prodCategoryCount = await productCategoryModel.countDocuments();
  const aucCategoryCount = await auctionRole.auctionCategory.countDocuments();
  const rolePrivilageCount = await authSchemas.rolePrivilage.countDocuments();

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
      const ply = helpers.privilageRolePlayer ;

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

  if (
    roleCount <= 0 &&
    privilageCout <= 0 &&
    prodCategoryCount <= 0 &&
    aucCategoryCount <= 0 &&
    rolePrivilageCount <= 0
  ) {
    await rolesSchema();
    await privilageSchema();
    await privilage();
    await productCategorySchema();
    await auctionCategorySchema();
  }
})();

const server = app.listen(PORT, async () => {
  console.log(`listening on https://${HOST}:${PORT}`);
  connectDB();
});

process.on("uncaughtException", (err) => {
  if (err) logger.error(err.stack);
  server.close(() => {
    console.log("Stopped server due to uncaughtException");
    console.log(err);
  });
});

process.on("unhandledRejection", (err) => {
  if (err) logger.error(err.stack);
  server.close(() => {
    console.log("Stopped server due to unhandledRejection");
    console.log(err);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved, Stopping server");
  server.close(() => {
    console.log("Stopped server");
  });
});
