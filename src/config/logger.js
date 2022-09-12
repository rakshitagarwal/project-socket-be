import winston, { createLogger, format, transports } from "winston";
import "dotenv/config";
import "winston-daily-rotate-file";
const { combine, json } = format;

/**
 * winston configuration for logger
 * @returns Object
 */

const combineFileTransport = new winston.transports.DailyRotateFile({
  dirname: "log/combined",
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "100m",
});

const errorFileTransport = new winston.transports.DailyRotateFile({
  dirname: "log/error",
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "100m",
  level: "error",
});

const logger = createLogger({
  level: "info",
  format: combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    winston.format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [combineFileTransport, errorFileTransport],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    })
  );
}

export default logger;
