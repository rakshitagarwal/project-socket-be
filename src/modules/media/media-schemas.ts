import { z } from "zod";

const uuidSchema = z.string().uuid();

const requestBodySchema = z.object({
    ids: z.array(uuidSchema),
});

const mediaSchema = { uuidSchema, requestBodySchema };
export default mediaSchema;
