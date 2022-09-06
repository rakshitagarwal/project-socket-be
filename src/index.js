import createError from "http-errors";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import morgan from "morgan";
import bodyParser from "body-parser";
import helpers from "./helper/helpers.js";
import cors from "cors";
import fs from "fs";
import Response from "./common/createResponses.js";
import logger from "./config/logger.js";
import env from "./config/env.js";

const app = express();
const port = env.PORT;
const LOG_ENV = env.LOG_ENV;

const swaggerDoc = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

app.use(morgan(LOG_ENV));
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
  const { statusCode, response } = Response.createResponse(
    helpers.StatusCodes.OK,
    {
      "/docs": "Gateway to BigDeal-API Swagger",
    }
  );
  res.status(statusCode).json(response);
});

app.use(function (req, res, next) {
  next(createError(helpers.StatusCodes.NOT_FOUND));
});

app.use(function (err, req, res) {
  res.status(helpers.statusCodes.INTERNAL_SERVER_ERROR);
  res.send(err);
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
  logger.info({
    level: "Info",
    message: `Listening on http://localhost:${port}`,
  });
});
