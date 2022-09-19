import Joi from "joi";

const price = Joi.number();
const title = Joi.string();
const description = Joi.string();

export const idSchema = Joi.object({
  id: Joi.string().required().messages({
    required_error: "ID must be present in responses",
    validate_error: "ID must be a string in responses",
  }),
});

/**
 * @description schemas for checking envariment varibales
 */
export const envSchema = Joi.object({
  PORT: Joi.number().required().messages({
    required_error: "PORT must be present in environment variables",
    invalid_type_error: "Invalid PORT in environment variables",
  }),
  DATABASE_URL: Joi.string().required().messages({
    required_error: "DATABASE_URL must be present in environment variables",
    invalid_type_error: "Invalid DATBASE_URL in environment variables",
  }),
  LOG_ENV: Joi.string().required().messages({
    required_error: "LOG_ENV must be present in environment variables",
    invalid_type_error: "Invalid LOG_ENV in environment variables",
  }),
  ALGORITHM: Joi.string().required().messages({
    required_error: "ALGORITHM must be present in environment variables",
    invalid_type_error: "Invalid ALGORITHM in environment variables",
  }),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().required().messages({
    required_error:
      "ACCESS_TOKEN_EXPIRES_IN must be present in environment variables",
    invalid_type_error: "Invalid ACCESS_TOKEN_EXPIRES in environment variables",
  }),
  FROM_EMAIL: Joi.string().required().messages({
    required_error: "FROM_EMAIL must be present in environment variables",
    invalid_type_error: "Invalid FROM_EMAIL in environment variables",
  }),
  EMAIL_USERNAME: Joi.string().required().messages({
    required_error: "EMAIL_USERNAME must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_USERNAME in environment variables",
  }),
  EMAIL_PASSWORD: Joi.string().required().messages({
    required_error: "EMAIL_PASSWORD must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_PASSWORD in environment variables",
  }),
  EMAIL_PORT: Joi.string().required().messages({
    required_error: "EMAIL_PORT must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_PORT in environment variables",
  }),
  EMAIL_HOST: Joi.string().required().messages({
    required_error: "EMAIL_HOST must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_HOST in environment variables",
  }),
  DB_NAME: Joi.string().required().messages({
    required_error: "DB_NAME must be present in environment variables",
    invalid_type_error: "Invalid DB_NAME in environment variables",
  }),
  FILE_STORAGE_PATH: Joi.string().required().messages({
    required_error:
      "FILE_STORAGE_PATH must be present in environment variables",
    invalid_type_error: "Invalid FILE_STORAGE_PATH in environment variables",
  }),
  FILE_ALLOWED_SIZE: Joi.string().required().messages({
    required_error:
      "FILE_ALLOWED_SIZE must be present in environment variables",
    invalid_type_error: "Invalid FILE_ALLOWED_SIZE in environment variables",
  }),
});

/**
 * @description schemas for checking the product request and response
 */
export const productSchema = Joi.object({
  title: Joi.required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  description: Joi.required().messages({
    required_error: "description must be present in responses",
    validate_error: "description must be a string in responses",
  }),
  purchasePrice: price.required().messages({
    required_error: "purchasePrice must be present in responses",
    validate_error: "purchasePrice must be a number in responses",
  }),
  sellingPrice: price.required().messages({
    required_error: "sellingPrice must be present in responses",
    validate_error: "sellingPrice must be a number in responses",
  }),
  overHeadCost: price.required().messages({
    required_error: "overHeadCost must be present in responses",
    validate_error: "overHeadCost must be a number in responses",
  }),
  quantity: price.required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a number in responses",
  }),
  ProductCategory: Joi.string().required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a string in responses",
  }),
});

/**
 * @description scheams for checking the query parmas for pagination
 */
export const paginationSchema = Joi.object({
  page: Joi.number().messages({
    invalid_type_error: "Invalid FILE_ALLOWED_SIZE in environment variables",
  }),
  limit: Joi.number().messages({
    invalid_type_error: "Invalid FILE_ALLOWED_SIZE in environment variables",
  }),
});
const fullName = Joi.string();
const email = Joi.string();
const password = Joi.string();
const role = Joi.string();

export const registers = Joi.object({
  fullName: fullName.required(),
  email: email.required(),
  password: password.required(),
  Role: role.required(),
});
