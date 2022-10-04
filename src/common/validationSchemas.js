import Joi from "joi";

const string = Joi.string();
const number = Joi.number();
const boolean = Joi.boolean();
const date = Joi.date();
const price = Joi.number();

const firstname = Joi.string().max(50);
const lastname = Joi.string().max(50);
const email = Joi.string().email();
const password = Joi.string();
const zip = Joi.number();
const country = Joi.string();
const gender = Joi.string().min(4).max(6).optional().allow("");
const age = Joi.number().optional().allow();
const mobile = Joi.number().optional().allow(null);
const profession = Joi.string().optional().allow("");
const role = Joi.string();

/**
 * @description moudleName scheams for checking the moduleName from query parmas
 */
export const moduleNameSchema = Joi.object({
  moduleName: string.required().messages({
    required_error: "MoudleName must be presnet",
  }),
});

/**
 * @description moudleName scheams for checking the moduleName from query parmas
 */
export const fileName = Joi.object({
  path: string.required().messages({
    required_error: "path must be presnet",
  }),
});

/**
 * @description scheams for chekcing both moduelName and path form query params
 */
export const queryParams = Joi.object({
  moduleName: string.required().messages({
    required_error: "MoudleName must be presnet",
  }),
  path: string.required().messages({
    required_error: "path must be presnet",
  }),
});

/**
 * @description schema for checking the ObjectIf from the Path params
 */
export const idSchema = Joi.object({
  id: string.required().messages({
    required_error: "ID must be present in responses",
    validate_error: "ID must be a string in responses",
  }),
});

/**
 * @description schemas for checking envariment varibales
 */
export const envSchema = Joi.object({
  PORT: number.required().messages({
    required_error: "PORT must be present in environment variables",
    invalid_type_error: "Invalid PORT in environment variables",
  }),
  DATABASE_URL: string.required().messages({
    required_error: "DATABASE_URL must be present in environment variables",
    invalid_type_error: "Invalid DATBASE_URL in environment variables",
  }),
  LOG_ENV: string.required().messages({
    required_error: "LOG_ENV must be present in environment variables",
    invalid_type_error: "Invalid LOG_ENV in environment variables",
  }),
  ALGORITHM: string.required().messages({
    required_error: "ALGORITHM must be present in environment variables",
    invalid_type_error: "Invalid ALGORITHM in environment variables",
  }),
  ACCESS_TOKEN_EXPIRES_IN: string.required().messages({
    required_error:
      "ACCESS_TOKEN_EXPIRES_IN must be present in environment variables",
    invalid_type_error: "Invalid ACCESS_TOKEN_EXPIRES in environment variables",
  }),
  FROM_EMAIL: string.required().messages({
    required_error: "FROM_EMAIL must be present in environment variables",
    invalid_type_error: "Invalid FROM_EMAIL in environment variables",
  }),
  EMAIL_USERNAME: string.required().messages({
    required_error: "EMAIL_USERNAME must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_USERNAME in environment variables",
  }),
  EMAIL_PASSWORD: string.required().messages({
    required_error: "EMAIL_PASSWORD must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_PASSWORD in environment variables",
  }),
  EMAIL_PORT: string.required().messages({
    required_error: "EMAIL_PORT must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_PORT in environment variables",
  }),
  EMAIL_HOST: string.required().messages({
    required_error: "EMAIL_HOST must be present in environment variables",
    invalid_type_error: "Invalid EMAIL_HOST in environment variables",
  }),
  DB_NAME: string.required().messages({
    required_error: "DB_NAME must be present in environment variables",
    invalid_type_error: "Invalid DB_NAME in environment variables",
  }),
  FILE_STORAGE_PATH: string.required().messages({
    required_error:
      "FILE_STORAGE_PATH must be present in environment variables",
    invalid_type_error: "Invalid FILE_STORAGE_PATH in environment variables",
  }),
  FILE_ALLOWED_SIZE: string.required().messages({
    required_error:
      "FILE_ALLOWED_SIZE must be present in environment variables",
    invalid_type_error: "Invalid FILE_ALLOWED_SIZE in environment variables",
  }),
  VIDEO_ALLOWED_SIZE: string.required().messages({
    required_error:
      "VIDEO_ALLOWED_SIZE must be present in environment variables",
    invalid_type_error: "Invalid VIDEO_ALLOWED_SIZE in environment variables",
  }),
  LANGUAGE_PATH: string.required().messages({
    required_error: "LANGUAGE_PATH must be present in environment variables",
    invalid_type_error: "Invalid LANGUAGE_PATH in environment variables",
  }),
  DEFAULT_LANGUAGE: string.required().messages({
    required_error: "DEFAULT_LANGUAGE must be present in environment variables",
    invalid_type_error: "Invalid DEFAULT_LANGUAGE in environment variables",
  }),
  LANGUAGE_PATH: string.required().messages({
    required_error: "LANGUAGE_PATH must be present in environment variables",
    invalid_type_error: "Invalid LANGUAGE_PATH in environment variables",
  }),
  DEFAULT_LANGUAGE: string.required().messages({
    required_error: "DEFAULT_LANGUAGE must be present in environment variables",
    invalid_type_error: "Invalid DEFAULT_LANGUAGE in environment variables",
  }),
});

/**
 * @description schemas for checking the product request and response
 */
export const productSchema = Joi.object({
  title: string.max(20, "UTF8").required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  image: string.required().messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  description: string.max(1000).required().messages({
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
  status: Joi.boolean().optional(),
  vendor: string.max(20).required().messages({
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
    invalid_type_error: "Invalid page number not allowed in params",
  }),
  limit: Joi.number().messages({
    invalid_type_error: "Invalid limits number not allowed in params",
  }),
});

/**
 * @description schemas for checking the query params for searching
 */
export const searchSchema = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  type: string.optional(),
  category: string.optional(),
});

export const auctionSearchSchema = Joi.object({
  page: Joi.number().messages({
    invalid_type_error: "Invalid page number not allowed in params",
  }),
  limit: Joi.number().messages({
    invalid_type_error: "Invalid page number not allowed in params",
  }),
  state: string.required().messages({
    invalid_type_error: "Invalid state number not allowed in params",
  }),
  status: Joi.boolean().required().messages({
    invalid_type_error: "Invalid status number not allowed in params",
  }),
  type: string.required().messages({
    invalid_type_error: "Invalid type number not allowed in params",
  }),
});

export const userSchema = Joi.object({
  firstname: firstname.required(),
  lastname: lastname.required(),
  email: email.required(),
  password: password.allow("").optional(),
  zip: zip.required(),
  country: country.required(),
  gender: gender,
  age: age,
  mobile: mobile,
  profession: profession,
  Role: role.required(),
});

export const userUpdateSchema = Joi.object({
  firstname: firstname.required(),
  lastname: lastname.required(),
  email: Joi.string().optional().allow(""),
  zip: zip.required(),
  country: country.required(),
  gender: gender,
  age: age,
  mobile: mobile,
  profession: profession,
});

export const loginSchema = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});

export const resetPassword = Joi.object({
  email: Joi.required(),
});

export const auctionPreRegister = Joi.object({
  startDate: Joi.date().required().messages({
    required_error: "startDate must be present in responses",
    validate_error: "startDate must be a string in responses",
  }),
  endDate: Joi.date().required().messages({
    required_error: "endDate must be present in responses",
    validate_error: "endDate must be a string in responses",
  }),
  participantCount: Joi.number().required().messages({
    required_error: "participantCount must be present in responses",
    validate_error: "participantCount must be a string in responses",
  }),
  participantFees: Joi.number().required().messages({
    required_error: "participantFees must be present in responses",
    validate_error: "participantFees must be a string in responses",
  }),
});

export const auctionPostRegister = Joi.object({
  participantFees: Joi.number().required().messages({
    required_error: "participantFees must be present in responses",
    validate_error: "participantFees must be a string in responses",
  }),
});

export const auctionSchema = Joi.object({
  title: string.messages({
    required_error: "title must be present in responses",
    validate_error: "title must be a string in responses",
  }),
  bannerImage: string.required({
    required_error: "bannerImage must be present in responses",
    validate_error: "bannerImage must be a string in responses",
  }),
  bannerVideo: string.messages({
    required_error: "bannerVideo must be present in responses",
    validate_error: "bannerVideo must be a string in responses",
  }),
  quantity: number.greater(0).required().messages({
    required_error: "quantity must be present in responses",
    validate_error: "quantity must be a string in responses",
  }),
  openingPrice: number.greater(0).required().messages({
    required_error: "openingPrice must be present in responses",
    validate_error: "openingPrice must be a string in responses",
  }),
  bot: boolean.required().messages({
    required_error: "bot must be present in responses",
    validate_error: "bot must be a boolean in responses",
  }),
  botMaxPrice: number.greater(0).required().messages({
    required_error: "botMaxPrice must be present in responses",
    validate_error: "botMaxPrice must be a number in responses",
  }),
  noOfPlayConsumed: number.greater(0).required().messages({
    required_error: "noOfPlayConsumed must be present in responses",
    validate_error: "noOfPlayConsumed must be a number in responses",
  }),
  bidIncrement: number.greater(0).required().messages({
    required_error: "bidIncrement must be present in responses",
    validate_error: "bidIncrement must be a number in responses",
  }),
  noNewBidderLimit: number.greater(0).required().messages({
    required_error: "noNewBidderLimit must be present in responses",
    validate_error: "noNewBidderLimit must be a number in responses",
  }),
  autoStart: boolean.required().messages({
    required_error: "autoStart must be present in responses",
    validate_error: "autoStart must be a number in responses",
  }),
  startDate: date.required().messages({
    required_error: "startDate must be present in responses",
    validate_error: "startDate must be a string in responses",
  }),
  endDate: date.required().messages({
    required_error: "endDate must be present in responses",
    validate_error: "endDate must be a string in responses",
  }),
  registerationStatus: boolean.required().messages({
    required_error: "registerationStatus must be present in responses",
    validate_error: "registerationStatus must be a number in responses",
  }),
  auctionPreRegister: auctionPreRegister,
  auctionPostRegister: auctionPostRegister,
  state: string
    .required()
    .valid("Active", "Publish", "Cancel", "Closed")
    .messages({
      required_error: "state must be present in responses",
      validate_error: "state must be a boolean in responses",
    }),
  status: boolean.allow().optional(),
  Product: string.required().messages({
    required_error: "Product must be present in responses",
    validate_error: "Product must be a string in responses",
  }),
  AuctionCategory: string.required().messages({
    required_error: "AuctionCategory must be present in responses",
    validate_error: "AuctionCategory must be a string in responses",
  }),
});
