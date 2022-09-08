import "dotenv/config";

const PORT = process.env.PORT;
const LOG_ENV = process.env.LOG_ENV;
const DB_URL = process.env.DB_URL + "/" + process.env.DB_NAME;

export const env = {
  PORT,
  DB_URL,
  LOG_ENV,
};
