import "dotenv/config";
import Joi from "joi";
import logger from "../config/logger.js";

const envSchema = Joi.object({
  PORT: Joi.number().not().exist().messages({
    required_error: "PORT must be present in environment variables",
    invalid_type_error: "Invalid PORT in environment variables",
  }),
  DATABASE_URL: Joi.string().not().empty().messages({
    required_error: "DATABASE_URL must be present in environment variables",
  }),
  LOG_ENV: Joi.string().not().empty().messages({
    required_error: "LOG_ENV must be present in environment variables",
  }),
  ALGORITHM: Joi.string().not().empty().messages({
    required_error: "ALGORITHM must be present in environment variables",
  }),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().not().empty().messages({
    required_error:
      "ACCESS_TOKEN_EXPIRES_IN must be present in environment variables",
  }),
  FROM_EMAIL: Joi.string().not().empty().messages({
    required_error: "FROM_EMAIL must be present in environment variables",
  }),
  EMAIL_USERNAME: Joi.string().not().empty().messages({
    required_error: "EMAIL_USERNAME must be present in environment variables",
  }),
  EMAIL_PASSWORD: Joi.string().not().empty().messages({
    required_error: "EMAIL_PASSWORD must be present in environment variables",
  }),
  EMAIL_PORT: Joi.string().not().empty().messages({
    required_error: "EMAIL_PORT must be present in environment variables",
  }),
  EMAIL_HOST: Joi.string().not().empty().messages({
    required_error: "EMAIL_HOST must be present in environment variables",
  }),
});

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

export const env = {
  value,
};
