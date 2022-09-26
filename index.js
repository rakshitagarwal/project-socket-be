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
import { dirname } from "path";
import { fileURLToPath } from "url";
import i18n from "i18n";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();
const PORT = env.PORT;
const LOG_ENV = env.LOG_ENV;

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(LOG_ENV));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(middlerware18.handle(i18next));
app.use("/assets/uploads", express.static(env.FILE_STORAGE_PATH));

// language configurations
i18n.configure({
  locales: ["en", "fr", "nl"],
  directory: process.cwd() + "/assets/locales",
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

const server = app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
  connectDB();
});

process.on("uncaughtException", (err) => {
  if (err) logger.error(err.stack);
  server.close(() => {
    console.log("Stopped server due to uncaughtException");
    console.log(err);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved, Stopping server");
  server.close(() => {
    console.log("Stopped server");
  });
});
