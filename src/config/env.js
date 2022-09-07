import "dotenv/config";

const PORT = process.env.PORT;
const DATBASE_URL = process.env.DATABASE_URL;
const LOG_ENV = process.env.LOG_ENV;
const ALGORITHM = process.env.ALGORITHM;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;

export const env = {
  PORT,
  DATBASE_URL,
  LOG_ENV,
  ALGORITHM,
  ACCESS_TOKEN_EXPIRES_IN,
};
