import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../common/responses";
import { verify, TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken"
import tokenPersistanceQuery from "../modules/token-persistent/token-persistent-queries"
import { MESSAGES } from "../common/constants";
interface IToken {
    id: string
}
/**
 * verify JWT_TOKEN from headers
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns Object
 */

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const response = responseBuilder.unauthorizedError()
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(response.code).json(response);
    }
    const token = req.headers.authorization.split(' ')[1]
    const publicKey = await tokenPersistanceQuery.findPersistentToken({ access_token: token })
    if (!publicKey) {
        return res.status(response.code).json(response);
    }
    return verify(token as string, publicKey.public_key as string, (err: unknown, decode) => {
        if (err instanceof TokenExpiredError) {
            const response = responseBuilder.unauthorizedError(
                MESSAGES.JWT.JWT_EXPIRED,
                {},
                err.stack
            );
            return res
                .status(response.code)
                .json(response);
        }

        if (err instanceof NotBeforeError) {
            const response = responseBuilder.unauthorizedError(
                MESSAGES.JWT.JWT_NOT_ACTIVE,
                {},
                err.stack
            );
            return res
                .status(response.code)
                .json(response);
        }

        if (err instanceof JsonWebTokenError) {
            const response = responseBuilder.unauthorizedError(
                MESSAGES.JWT.JWT_MALFORMED,
                {},
                err.stack
            );
            return res
                .status(response.code)
                .json(response);
        }
        res.locals = decode as Record<string, string | number> & IToken;
        next()
        return
    })
}

export default isAuthenticated