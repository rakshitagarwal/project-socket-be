import { NextFunction, Request, Response } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { ZodSchema } from "zod";
import { responseBuilder } from "../common/responses";

const validateRequest = (() => {
    const validate = async (
        schema: ZodSchema,
        data: ParamsDictionary | Query,
        res: Response,
        _req: Request,
        next: NextFunction
    ) => {
        const parsedBody = await schema.safeParseAsync(data);
        if (!parsedBody.success) {
            const response = responseBuilder.badRequestError(
                parsedBody.error.message,
                {},
                parsedBody.error.issues
            );

            res.status(response.code).json(response);
            return;
        }
        next();
    };

    const params =
        (schema: ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            await validate(schema, req.params, res, req, next);
        };

    const body =
        (schema: ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            await validate(schema, req.body, res, req, next);
        };

    const query =
        (schema: ZodSchema) =>
        async (req: Request, res: Response, next: NextFunction) => {
            await validate(schema, req.query, res, req, next);
        };

    return {
        params,
        body,
        query,
    };
})();

export default validateRequest;
