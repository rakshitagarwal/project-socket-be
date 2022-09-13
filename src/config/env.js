import "dotenv/config";
import logger from "../config/logger.js";
import { envSchema } from "../common/validationSchemas.js";

const { error, value: env } = Object.freeze(
  envSchema.validate({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    LOG_ENV: process.env.LOG_ENV,
    ALGORITHM: process.env.ALGORITHM,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    FROM_EMAIL: process.env.FROM_EMAIL,
    DB_NAME: process.env.DB_NAME,
  })
);

if (error) {
  logger.error({
    type: "error",
    message: error.message,
  });
}

export default env;
