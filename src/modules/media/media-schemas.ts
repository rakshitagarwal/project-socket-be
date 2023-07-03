import { z } from "zod";

const uuidSchema = z.object({
    id: z.string().uuid(),
});

const requestBodySchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

const mediaSchema = { uuidSchema, requestBodySchema };
export default mediaSchema;
