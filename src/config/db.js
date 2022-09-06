import mongoose from "mongoose";
import logger from "./logger.js";
import env from "./env.js";

const connectDB = async () => {
  try {
    const connectdb = await mongoose.connect(env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection");
  } catch (error) {
    logger.error(error);
  }
};
export default connectDB;
