import createError from "http-errors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { helpers } from "./helper/helpers.js";
import cors from "cors";
import fs from "fs";
import { createResponse } from "./common/utilies.js";
import { env } from "./config/env.js";
import connectDB from "./config/db.js";
const app = express();

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(env.LOG_ENV));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  "/docs",
  serve,
  setup(swaggerDoc, {
    swaggerOptions: { filter: "", persistAuthorization: true },
    customSiteTitle: "BigDeal Admin-Panel Swagger",
    explorer: true,
  })
);

app.use("/", (req, res) => {
  const { statusCode, response } = createResponse(helpers.StatusCodes.OK, {
    "/docs": "Gateway to BigDeal-API Swagger",
  });
  res.status(statusCode).json(response);
});

app.use(function (req, res, next) {
  next(createError(helpers.StatusCodes.NOT_FOUND));
});

app.use(function (err, req, res, next) {
  res.status(helpers.StatusCodes.INTERNAL_SERVER_ERROR);
  res.send(err);
  next();
});

app.listen(env.PORT, () => {
  connectDB();
  console.log(`listening on http://localhost:${env.PORT}`);
});
