import { Request, Response, NextFunction } from "express";
import { responseBuilder } from "../common/responses";
import logger from "../config/logger";
import { Prisma } from "@prisma/client";
import env from "../config/env";
import { codes } from "../common/prisma.code";
import { IerrorHandle } from "./typings/middleware-types";

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

    const metaData: IerrorHandle = {
        name: err.name,
        message: err.message,
    };

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        metaData.code = err.code;
        metaData.prisma_code = codes[err.code];
    }
    else {
        metaData.code = err.name;
        metaData.prisma_code = err.message;
    }

    const response = responseBuilder
        .error(500)
        .message(err.message)
        .data()
        .metaData(metaData)
        .build();

    logger.error(`${env.NODE_ENV}  - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack || 'N/A'}`);
    res.status(response.code).json(response);
};