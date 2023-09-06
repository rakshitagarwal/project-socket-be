import { z } from "zod";

const uuidSchema = z
    .object({
        id: z.string().uuid(),
    })
    .strict();

const requestBodySchema = z
    .object({
        reward_plays: z.number().min(1),
        credit_plays: z.number().min(1),
    })
    .strict();

const referralSchema = { uuidSchema, requestBodySchema };
export default referralSchema;