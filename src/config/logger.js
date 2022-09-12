import winston, { createLogger, format, transports } from "winston";
import "dotenv/config";
import "winston-daily-rotate-file";
const { combine, json } = format;

/**
 * winston configuration for logger
 * @returns Object
 */
const productionLogger = () => {
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

  return createLogger({
    level: "info",
    format: combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      json(),
      winston.format.json()
    ),
    defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(),
      combineFileTransport,
      errorFileTransport,
    ],
  });
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  // logger = productionLogger();
}

export default logger;
