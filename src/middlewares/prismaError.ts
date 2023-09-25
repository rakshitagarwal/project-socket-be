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
    err: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientInitializationError | Prisma.PrismaClientRustPanicError
        | Prisma.PrismaClientUnknownRequestError | Prisma.PrismaClientValidationError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const response = responseBuilder
            .error(500)
            .message(err.message)
            .data()
            .metaData({ name: err.name, code: err.code, prisma_code: codes[err.code], message: err.message })
            .build();

        logger.error(
            `${env.NODE_ENV} - ${err.code} - ${err.clientVersion} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`
        );
        res.status(response.code).json(response);
    }
    else if (err instanceof Prisma.PrismaClientInitializationError ||
        err instanceof Prisma.PrismaClientRustPanicError ||
        err instanceof Prisma.PrismaClientUnknownRequestError ||
        err instanceof Prisma.PrismaClientValidationError) {
        const response = responseBuilder
            .error(500) // You can change the status code as needed
            .message(err.message)
            .data()
            .metaData({ name: err.name, message: err.message }) // Customize the metadata as needed
            .build();

        logger.error(
            `${env.NODE_ENV} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        res.status(response.code).json(response);
    } else {
        // Handle other types of errors or fallback to a generic error response
        const response = responseBuilder.internalserverError("", {}, err);
        logger.error(
            `${process.env.NODE_ENV} - UnknownError - An unknown error occurred - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
        res.status(response.code).json(response);
    }
};
