import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../common/responses";
import { verify, TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken"
import tokenPersistanceQuery from "../modules/token-persistent/token-persistent-queries"
import { MESSAGES } from "../common/constants";
import { Itoken } from "./typings/middleware-types"
/**
 * verify JWT_TOKEN from headers
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns Object
 */

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const userToken = await tokenPersistanceQuery.findPersistentToken({ refresh_token: req.body.refreshToken })    
    if (!userToken) {
        const response= responseBuilder.notFoundError(MESSAGES.JWT.TOKEN_NOT_FOUND)
        return res.status(response.code).json(response);
    }    
    return verify(req.body.refreshToken as string, userToken.public_key as string, (err: unknown, _decode) => {
        if (err instanceof TokenExpiredError) {
            const response = responseBuilder.unauthorizedError(MESSAGES.JWT.JWT_EXPIRED, {}, err.stack);
            return res.status(response.code).json(response);
        }
        return verify(userToken.access_token as string, userToken.public_key as string, (err: unknown, _decode) => {
            if (err instanceof TokenExpiredError) {
                next()
                return
            }
            const response = responseBuilder.badRequestError(MESSAGES.JWT.TOKEN_NOT_EXPIRED);
            return res.status(response.code).json(response);

        })
    })

}

/**
 * verify JWT_TOKEN from headers
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns Object
 */

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {    
    if (req.body.refreshToken) {
        return refreshToken(req, res, next)
    }
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
        res.locals = decode as Record<string, string | number> & Itoken;
        next()
        return
    })
}

export default isAuthenticated