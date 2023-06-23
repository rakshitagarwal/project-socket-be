import { Request, Response, NextFunction } from "express";
import { responseBuilder } from "../common/responses";
import logger from "../config/logger";
import env from "../config/env";

/**
 * Error handler middleware.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const commonErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const response = responseBuilder.internalserverError();
    logger.error(
        `${env.NODE_ENV} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`
    );
    res.status(response.code).json(response);
};
