import { z } from "zod";

const uuidSchema = z
    .object({
        id: z.string().uuid(),
    })
    .strict();

const requestBodySchema = z
    .object({
        ids: z.array(z.string().uuid()).min(1),
    })
    .strict();

const mediaSchema = { uuidSchema, requestBodySchema };
export default mediaSchema;
