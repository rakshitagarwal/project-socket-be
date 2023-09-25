import { Request, Response, NextFunction } from "express";
import { responseBuilder } from "../common/responses";
import logger from "../config/logger";
import { Prisma } from "@prisma/client";
import env from "../config/env";
import { codes } from "../common/prisma.code";


/**
 * Error handler middleware.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const prismaErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const response = responseBuilder
            .error(500)
            .message(err.message)
            .data({
                prisma_code: codes[err.code],
                message: err.message
            })
            .metaData({ ...err })
            .build();

        logger.error(
            `${env.NODE_ENV} - ${err.code} - ${err.clientVersion} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`
        );
        res.status(response.code).json(response);
    }
    // TODO: Try, if condition doesnt work, then call next with error:- next(err)
    const response = responseBuilder.internalserverError("", {}, err);

    logger.error(
        `${process.env.NODE_ENV} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    res.status(response.code).json(response);
};


// Prisma Error Middleware
// app.use(function (error: Error, _req: Request, res: Response, next: NextFunction) {
//     if (error) {
//         const response = responseBuilder.error(500).message(`${codes[error.code]}`).metaData({ error: error.stack }).build();
//         return res.status(response.code).json(response);
//     }
//     return next(error);
// });