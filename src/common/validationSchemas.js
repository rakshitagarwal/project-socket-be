import Joi from "joi";

const price = Joi.number();
const module = Joi.string();
const path = Joi.string();
const fullName = Joi.string();
const email = Joi.string();
const password = Joi.string();
const role = Joi.string();
const page = Joi.number();
const limit = Joi.number();

/**
 * @description moudleName scheams for checking the moduleName from query parmas
 */
export const moduleNameSchema = Joi.object({
  moduleName: module.required(),
});

/**
 * @description moudleName scheams for checking the moduleName from query parmas
 */
export const fileName = Joi.object({
  path: path.required(),
});

/**
 * @description scheams for chekcing both moduelName and path form query params
 */
export const queryParams = Joi.object({
  moduleName: module.required(),
  path: path.required(),
});

/**
 * @description schema for checking the ObjectIf from the Path params
 */
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
  VIDEO_ALLOWED_SIZE: Joi.string().required().messages({
    required_error:
      "VIDEO_ALLOWED_SIZE must be present in environment variables",
    invalid_type_error: "Invalid VIDEO_ALLOWED_SIZE in environment variables",
  }),
  LANGUAGE_PATH: Joi.string().required().messages({
    required_error: "LANGUAGE_PATH must be present in environment variables",
    invalid_type_error: "Invalid LANGUAGE_PATH in environment variables",
  }),
  DEFAULT_LANGUAGE: Joi.string().required().messages({
    required_error: "DEFAULT_LANGUAGE must be present in environment variables",
    invalid_type_error: "Invalid DEFAULT_LANGUAGE in environment variables",
  }),
});

/**
 * @description schemas for checking the product request and response
 */
export const productSchema = Joi.object({
  title: Joi.string().max(20).required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  image: Joi.string().required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  description: Joi.string().max(1000).required().messages({
    required_error: "description must be present in responses",
    validate_error: "description must be a string in responses",
  }),
  purchasePrice: price.integer().min(20).required().messages({
    required_error: "purchasePrice must be present in responses",
    validate_error: "purchasePrice must be a number in responses",
  }),
  sellingPrice: price.integer().min(20).required().messages({
    required_error: "sellingPrice must be present in responses",
    validate_error: "sellingPrice must be a number in responses",
  }),
  overHeadCost: price.integer().min(20).required().messages({
    required_error: "overHeadCost must be present in responses",
    validate_error: "overHeadCost must be a number in responses",
  }),
  quantity: price.integer().max(20).required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a number in responses",
  }),
  vendor: Joi.string().max(20).required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  ProductCategory: Joi.string().required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a string in responses",
  }),
});

export const updateProductSchema = Joi.object({
  title: Joi.string().max(20).required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  image: Joi.string().required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  description: Joi.string().max(1000).required().messages({
    required_error: "description must be present in responses",
    validate_error: "description must be a string in responses",
  }),
  purchasePrice: price.integer().min(20).required().messages({
    required_error: "purchasePrice must be present in responses",
    validate_error: "purchasePrice must be a number in responses",
  }),
  sellingPrice: price.integer().min(20).required().messages({
    required_error: "sellingPrice must be present in responses",
    validate_error: "sellingPrice must be a number in responses",
  }),
  overHeadCost: price.integer().min(20).required().messages({
    required_error: "overHeadCost must be present in responses",
    validate_error: "overHeadCost must be a number in responses",
  }),
  quantity: price.integer().max(20).required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a number in responses",
  }),
  vendor: Joi.string().max(20).required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  status: Joi.boolean().required().default(false).messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
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
  page: page.messages({
    invalid_type_error: "Invalid page number not allowed in params",
  }),
  limit: limit.messages({
    invalid_type_error: "Invalid limits number not allowed in params",
  }),
});

/**
 * @description schemas for checking the query params for searching
 */
export const searchSchema = Joi.object({
  page: page.messages({
    invalid_type_error: "Invalid page number not allowed in params",
  }),
  limit: page.messages({
    invalid_type_error: "Invalid limit number not allowed in params",
  }),
  searchText: Joi.string().max(20).messages({
    invalid_type_error: "Character Limit excceded",
  }),
});

export const registerSchema = Joi.object({
  fullName: fullName.required(),
  email: email.required(),
  password: password.required(),
  Role: role.required(),
});

export const loginSchema = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});
