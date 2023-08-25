import { Socket } from "socket.io";
import tokenPersistanceQuery from "../modules/token-persistent/token-persistent-queries";
import {
    verify,
    TokenExpiredError,
    NotBeforeError,
    JsonWebTokenError,
} from "jsonwebtoken";
import { MESSAGES } from "../common/constants";

/**
@description-Checks if a user is authenticated based on the provided access token.
@param {Socket} socket - The socket object representing the client connection.
@param {(err?: Error) => void} next - The callback function to call after authentication.
@returns {void}
@throws {Error} If authentication fails.
*/
const socketAuthentication = async (
    socket: Socket,
    next: (err?: Error) => void
) => {
    const { accesstoken } = socket.handshake.query;
    if (accesstoken) {
        const publicKey = await tokenPersistanceQuery.findPersistentToken({
            access_token: accesstoken as string,
        });
        if (publicKey) {
            return verify(
                accesstoken as string,
                publicKey.public_key as string,
                (err: unknown, decode) => {
                    if (err instanceof TokenExpiredError) {
                        next(new Error(MESSAGES.JWT.JWT_EXPIRED));
                    }

                    if (err instanceof NotBeforeError) {
                        next(new Error(MESSAGES.JWT.JWT_NOT_ACTIVE));
                    }

                    if (err instanceof JsonWebTokenError) {
                        next(new Error(MESSAGES.JWT.JWT_MALFORMED));
                    }
                    socket.handshake.auth.id = decode;
                    return next();
                }
            );
        }
    }
    next(new Error(MESSAGES.JWT.UNAUTHORIZED));
};

export default socketAuthentication;
