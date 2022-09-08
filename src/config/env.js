import "dotenv/config";
import logger from "../config/logger.js";
import { envSchema } from "../common/validationSchemas.js";

const { error, value } = Object.freeze(
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
  })
);

if (error) {
  logger.error({
    type: "error",
    message: error.message,
  });
}

const {
  PORT,
  DATABASE_URL,
  LOG_ENV,
  ALGORITHM,
  ACCESS_TOKEN_EXPIRES_IN,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_HOST,
  FROM_EMAIL,
} = value;

export const env = {
  PORT,
  DATABASE_URL,
  LOG_ENV,
  ALGORITHM,
  ACCESS_TOKEN_EXPIRES_IN,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_HOST,
  FROM_EMAIL,
};
