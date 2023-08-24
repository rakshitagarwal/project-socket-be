import socketio, { Namespace } from "socket.io";
import { Server } from "http";
import env from "../config/env";
import logger from "../config/logger";
import socketAuthentication from "../middlewares/socket-authentication";
import { newBiDRecieved } from "../modules/auction/auction-publisher";
import { bidByBotRecieved, bidbotStatus, deactivateBidbot } from "../modules/bid-bot/bid-bot-publisher";
export interface AppGlobal {
    playerSocket: Namespace;
}

const socketService = async (server: Server) => {
    const io = new socketio.Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });

    /**
     * Represents a socket connection with authentication and health monitoring.
     * @param {SocketIO.Namespace} socket - The socket namespace.
     * @returns {void}
     */
    const socketService = io.of(env.API_VERSION);
    (global as unknown as AppGlobal).playerSocket = socketService;
    socketService.use(socketAuthentication);

    /**
     * Event handler for socket connection.
     * @param {SocketIO.Socket} socket - The socket object.
     * @returns {void}
     */
    socketService.on("connection", (socket) => {
        const client = socket.handshake.auth.id;
        if (!client?.id) {
            socket.disconnect();
        } else {
            logger.info({ level: "info", message: "socket connected" });
            socket.on("health", (data) => {
                socket.emit("healthResponse", {
                    info: "health connected",
                    ...data,
                });
            });
            socket.on("auction:bid", (data) => {
                newBiDRecieved(data, socket.id);
            });
            socket.on("auction:bidbot", (data) => {
                bidByBotRecieved(data, socket.id);
            });
            socket.on("auction:bidbot:deactivate", (data) => {
                deactivateBidbot(data, socket.id);
            });
            socket.on("session:bidbot:status", (data) => {
                bidbotStatus(data, socket.id);
            });
        }
    });
    return socketService;
};
export default socketService;
