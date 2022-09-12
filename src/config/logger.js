import winston, { createLogger, format, transports } from "winston";
import "dotenv/config";
const { combine, json } = format;

/**
 * winston configuration for logger
 * @returns Object
 */
const logger = createLogger({
  level: "info",
  format: combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    winston.format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: "log/combined",
      filename: "combined.log",
    }),
    new transports.File({
      dirname: "log/errors",
      filename: "error.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  // logger = productionLogger();
}

export default logger;
