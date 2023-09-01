import winston from "winston";
import env from "./env";

/**
 * Winston Logger
 * @description whenever any error or warning occurs it will log in our terminal in development and in production it will store in file
 */
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    defaultMeta: { service: "backend-service" },
    handleRejections: true,
    transports: [
        new winston.transports.File({
            dirname: env.LOG_DIR + "/errors",
            filename: "error.log",
            level: "error",
        }),
        new winston.transports.File({
            dirname: env.LOG_DIR + "/combined",
            filename: "combined.log",
        }),
    ],
});

/**
 * @description If we're not in production then log to the `console` with the format: `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */

logger.add(
    new winston.transports.Console({
        level: "debug",
        format: winston.format.timestamp(),
    })
);

export default logger;
