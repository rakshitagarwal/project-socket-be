import socketio, { Namespace } from "socket.io";
import { Server } from "http";
import env from "../config/env";
import logger from "../config/logger";
import socketAuthentication from "../middlewares/socket-authentication";

 export interface AppGlobal {
    userSocket: Namespace
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
    const socket = io.of(env.API_VERSION);
    (global  as unknown as AppGlobal).userSocket = socket;
    socket.use(socketAuthentication);

    /**
     * Event handler for socket connection.
     * @param {SocketIO.Socket} socket - The socket object.
     * @returns {void}
     */
    socket.on("connection", (socket) => {
        const { accesstoken } = socket.handshake.auth;
        if (!accesstoken) {
            socket.disconnect();
        }
        logger.info({ level: "info", message: "socket connected" });
        socket.on("health", (data) => {
            socket.emit("healthResponse", { info: "health connected",...data });
        });
        socket.on("status", (data) => {
            socket.emit("status:response", { info: "status connect",...data  });
        });
    });
    return socket;
};
export default socketService;
