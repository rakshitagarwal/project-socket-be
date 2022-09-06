import "dotenv/config";

const PORT = process.env.PORT;
const LOG_ENV = process.env.LOG_ENV;

const env = {
  PORT,
  LOG_ENV,
};

export default env;
