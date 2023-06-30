import { z } from "zod";

const uuidSchema = z.string().uuid();

const requestBodySchema = z.object({
    id: z.array(uuidSchema),
});

const mediaSchema = { uuidSchema, requestBodySchema };
export default mediaSchema;
