/*
 * @description BiG Deal API
 * @version 1.0.0
 * @copyright GlobalVox Ventures Pvt. Ltd. 2023
 */
import express from "express";
import { commonErrorHandler } from "./middlewares/commonError";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import hpp from "hpp";
import userAgent from "express-useragent";
import requestIp from "request-ip";
import env from "./config/env";
import { prismaErrorHandler } from "./middlewares/prismaError";
import { generateDocs } from "./utils/generate-docs";
import { responseBuilder } from "./common/responses";
import { v1Router } from "./routes/index-routes";
import logger from "./config/logger";
import startServer from "./utils/start-server";

const app = express();

app.use("/assets/uploads", express.static("assets/uploads"));
app.use(helmet());
app.use(cors());
app.disable("x-powered-by");
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(
    bodyParser.json({
        limit: "20mb",
        type: "application/json",
    })
);
app.use(hpp());
app.use(userAgent.express());
app.use(requestIp.mw());

/**
 * Swagger Docs
 * @param {Express} app - reference of express
 */
process.env.NODE_ENV !== "production" && generateDocs(app);

/**
 * Version Routes
 * @description versioning of routes dependent on Api
 */
app.use(env.API_VERSION, v1Router);

/**
 * Route Not Found
 * @description used when not routes where found
 */
app.use("*", (req, res) => {
    const response = responseBuilder.notFoundError();
    logger.error(
        `${response.code} - ${response.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(response.code).json(response);
});

/**
 * Error Middlewares
 */
app.use(prismaErrorHandler);
app.use(commonErrorHandler);

/**
 * Http Server listening 🚀
 */
startServer()
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log(error);
    });

export default app;
