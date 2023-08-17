import { createClient } from "redis";
import env from "./env";
import logger from "./logger";

const redisClient = createClient({
    socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        connectTimeout: 10000,
    },
});
redisClient
    .connect()
    .then(() => console.log("🚀 Redis connected 🚀"))
    .catch((error) => {
        logger.error(error);
    });

export default redisClient;
