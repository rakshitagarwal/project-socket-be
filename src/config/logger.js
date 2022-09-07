import winston, { createLogger, format, transports } from "winston";
import "dotenv/config";
const { combine, timestamp, json } = format;

const productionLogger = () => {
  return createLogger({
    level: "info",
    format: combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      json(),
      winston.format.prettyPrint()
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
};

let logger = null;

if (process.env.NODE_ENV === "production") {
  logger = productionLogger();
}

export default logger;
