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
    FILE_STORAGE_PATH: process.env.FILE_STORAGE_PATH,
    FILE_ALLOWED_SIZE: process.env.FILE_ALLOWED_SIZE,
    VIDEO_ALLOWED_SIZE: process.env.VIDEO_ALLOWED_SIZE,
    LANGUAGE_PATH: process.env.LANGUAGE_PATH,
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
  })
);

if (error) {
  logger.error({
    type: "error",
    message: error.message,
  });
}

export default env;
