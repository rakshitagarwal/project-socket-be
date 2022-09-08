import express from "express";
import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { helpers } from "./helper/helpers.js";
import cors from "cors";
import fs from "fs";
import { createResponse, sendEmail } from "./common/utilies.js";
import { userRouter } from "./user/user-routers.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import logger from "./config/logger.js";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middlerware18 from "i18next-http-middleware";
import cookieParser from "cookie-parser";

const app = express();
const PORT = env.PORT;
const LOG_ENV = env.LOG_ENV;

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(LOG_ENV));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(middlerware18.handle(i18next));

// language configurations
i18next
  .use(Backend)
  .use(middlerware18.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: process.cwd() + "/assets/locales/{{lng}}.json",
    },
  });

// intialize the routers
// app.use("/user", userRouter);

app.get("/check/language", (req, res) => {
  res
    .status(helpers.StatusCodes.OK)
    .json({ message: req.t("user_create_success") });
});

app.use("/", (req, res) => {
  const { statusCode, response } = createResponse(helpers.StatusCodes.OK, {
    "/docs": "Gateway to BigDeal-API Swagger",
  });
  res.status(statusCode).json(response);
});

app.use(
  "/docs",
  serve,
  setup(swaggerDoc, {
    swaggerOptions: { filter: "", persistAuthorization: true },
    customSiteTitle: "BigDeal Admin-Panel Swagger",
    explorer: true,
  })
);

app.use(function (err, req, res) {
  res.status(helpers.StatusCodes.INTERNAL_SERVER_ERROR);
  res.send(err);
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
