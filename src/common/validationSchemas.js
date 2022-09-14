import Joi from "joi";

/**
 * schemas for checking envariment varibales
 */
export const envSchema = Joi.object({
  PORT: Joi.number().not().exist().messages({
    required_error: "PORT must be present in environment variables",
    invalid_type_error: "Invalid PORT in environment variables",
  }),
  DATABASE_URL: Joi.string().required().messages({
    required_error: "DATABASE_URL must be present in environment variables",
  }),
  LOG_ENV: Joi.string().required().messages({
    required_error: "LOG_ENV must be present in environment variables",
  }),
  ALGORITHM: Joi.string().required().messages({
    required_error: "ALGORITHM must be present in environment variables",
  }),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().required().messages({
    required_error:
      "ACCESS_TOKEN_EXPIRES_IN must be present in environment variables",
  }),
  FROM_EMAIL: Joi.string().required().messages({
    required_error: "FROM_EMAIL must be present in environment variables",
  }),
  EMAIL_USERNAME: Joi.string().required().messages({
    required_error: "EMAIL_USERNAME must be present in environment variables",
  }),
  EMAIL_PASSWORD: Joi.string().required().messages({
    required_error: "EMAIL_PASSWORD must be present in environment variables",
  }),
  EMAIL_PORT: Joi.string().required().messages({
    required_error: "EMAIL_PORT must be present in environment variables",
  }),
  EMAIL_HOST: Joi.string().required().messages({
    required_error: "EMAIL_HOST must be present in environment variables",
  }),
  DB_NAME: Joi.string().required().messages({
    required_error: "DB_NAME must be present in environment variables",
  }),
});
