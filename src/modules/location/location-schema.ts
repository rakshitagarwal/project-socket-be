import { z } from "zod";

const countries = z.object({
    name: z
        .string({
            required_error: "name is required",
            invalid_type_error: "name must be string",
        })
        .trim()
        .optional(),
    code: z
        .string({
            required_error: "code is required",
            invalid_type_error: "code must be string",
        })
        .trim()
        .optional(),
});

export const locationSchemas = {
    countries,
};
