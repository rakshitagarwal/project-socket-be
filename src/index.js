import createError from "http-errors";
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

const app = express();
const port = env.PORT;
const LOG_ENV = env.LOG_ENV;

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(LOG_ENV));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// intialize the routers
app.use("/user", userRouter);

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

app.use(function (req, res, next) {
  next(createError(helpers.StatusCodes.NOT_FOUND));
});

app.use(function (err, req, res) {
  res.status(helpers.StatusCodes.INTERNAL_SERVER_ERROR);
  res.send(err);
});

const server = app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
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
