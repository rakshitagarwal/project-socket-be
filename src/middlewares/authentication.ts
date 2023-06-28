import { NextFunction, Request, Response } from "express";
import { responseBuilder } from "../common/responses";
import { verify } from "jsonwebtoken"
import tokenPersistanceQuery from "../modules/token-persistent/token-persistent-queries"

interface IToken{
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
        if (err instanceof Error) {
            return res.status(response.code).json(response);
        }
        res.locals = decode as Record<string, string | number> & IToken;
        next()
        return
    })
}

export default isAuthenticated