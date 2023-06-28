import { checkHealth } from "../config/db";
import logger from "../config/logger";
import app from "..";
import env from "../config/env";

async function startServer() {
    const checking = await checkHealth();
    if (!checking) {
        return `🚀 DATABASE NOT CONNECTED 🚀`;
    }

    const server = app.listen(env.PORT, "0.0.0.0", () => {
        console.log(`🚀 Server listening on http://localhost:${env.PORT} 🚀`);
    });

    process.on("uncaughtException", (err) => {
        logger.error(err.stack);
        server.close(() => {
            console.log("Stopped server due to uncaughtException");
            console.log(err);
        });
    });

    process.on("SIGTERM", () => {
        console.log("SIGTERM signal recieved, Stopping server");
        server.close(() => {
            console.log("Stopped server");
        });
    });

    return `🚀 DATABASE CONNECTED 🚀`;
}

export default startServer;
