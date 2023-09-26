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
type PrismaError =
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientRustPanicError
    | Prisma.PrismaClientUnknownRequestError
    | Prisma.PrismaClientValidationError;

export const prismaErrorHandler = (
    err: PrismaError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let response;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        response = responseBuilder
            .error(500)
            .message(err.message)
            .data()
            .metaData({ name: err.name, code: err.code, prisma_code: codes[err.code], message: err.message })
            .build();
    } else {
        response = responseBuilder
            .error(500)
            .message(err.message)
            .data()
            .metaData({ name: err.name, message: err.message })
            .build();
    }
    logger.error(`${env.NODE_ENV}  - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack || 'N/A'}`);
    res.status(response.code).json(response);
};
