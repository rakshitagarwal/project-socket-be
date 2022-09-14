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

export const productSchema = Joi.object({
  title: Joi.string().required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  description: Joi.string().required().messages({
    required_error: "description must be present in responses",
    validate_error: "description must be a string in responses",
  }),
  image: Joi.string().required().messages({
    required_error: "image must be present in responses",
    validate_error: "image must be a string in responses",
  }),
  purchasePrice: Joi.number().required().messages({
    required_error: "purchasePrice must be present in responses",
    validate_error: "purchasePrice must be a number in responses",
  }),
  sellingPrice: Joi.number().required().messages({
    required_error: "sellingPrice must be present in responses",
    validate_error: "sellingPrice must be a number in responses",
  }),
  overHeadCost: Joi.number().required().messages({
    required_error: "overHeadCost must be present in responses",
    validate_error: "overHeadCost must be a number in responses",
  }),
  quantity: Joi.number().required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a number in responses",
  }),
  ProductCategory: Joi.string().required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a string in responses",
  }),
});
