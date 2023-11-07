import { checkHealth } from "../config/db";
import logger from "../config/logger";
import app from "..";
import env from "../config/env";
import socketService from "./socket-service";


/**
 * Starts the server and listens on the specified port. Sets up event listeners for uncaught exceptions
 * and SIGTERM signal to gracefully handle server shutdown.
 * @param {number} PORT - The port number on which the server will listen.
 * @returns {http.Server} The server instance that is listening on the specified port.
 */
async function startServer() {
    const checking = await checkHealth();
    if (!checking) {
        return `🚀 DATABASE NOT CONNECTED 🚀` 
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
    socketService(server);

    return `🚀 DATABASE CONNECTED 🚀` 
}

export default startServer;
