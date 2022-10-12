import mongoose from "mongoose";
import env from "./env.js";
import logger from "./logger.js";

const URL = env.DATABASE_URL;

const options = {
  dbName: env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * connect with Database
 */
export const connectDB = () => {
  mongoose.connect(URL, options, (err) => {
    if (err) {
      logger.error({ type: "error", message: err });
    } else {
      mongoose.connection.on("connected", () => {
        console.log("Connected to database...");
      });
      mongoose.connection.on("error", (err) => {
        logger.error({ type: "error", message: err.message });
      });
      mongoose.connection.on("disconnected", () =>
        logger.log({ type: "error", message: "disconnected}" })
      );
      logger.info({
        level: "info",
        message: "Database Connected",
      });
    }
  });

  // debuger for database queries
  mongoose.set("debug", (collectioName, methodName, ...methodArgs) => {
    logger.info(`${collectioName}.${methodName}(${methodArgs.join(", ")})`);
  });
};
