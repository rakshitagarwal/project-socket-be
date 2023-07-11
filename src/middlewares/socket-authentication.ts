import { Socket } from "socket.io";
import tokenPersistanceQuery from "../modules/token-persistent/token-persistent-queries"
import { verify} from "jsonwebtoken"


/**
@description-Checks if a user is authenticated based on the provided access token.
@param {Socket} socket - The socket object representing the client connection.
@param {(err?: Error) => void} next - The callback function to call after authentication.
@returns {void}
@throws {Error} If authentication fails.
*/
const socketAuthentication = (socket: Socket, next: (err?: Error) => void) => {
    const { accesstoken } = socket.handshake.auth;
    if (accesstoken) {
        const publicKey = await tokenPersistanceQuery.findPersistentToken({ access_token: accesstoken })
        return verify(token as string, publicKey.public_key as string, (err: unknown, decode) => {
            if (err) {
                next(new Error('Authentication failed'));
            }
            return next()
    })
    next(new Error('Authentication failed'));
}
export default socketAuthentication