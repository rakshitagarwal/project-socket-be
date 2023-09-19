import { z } from "zod";

const uuidSchema = z
    .object({
        id: z.string().uuid(),
    })
    .strict();

const requestBodySchema = z
    .object({
        status: z.boolean().optional(),
        bid_increment: z.number(),
        big_token: z.number(),
        usdt: z.number(),
        usdc: z.number(),
    })
    .strict();

const findCurrency = z.object({
    currency_code: z.string().length(3).optional(),
})
.strict();


const currencySchema = { uuidSchema, requestBodySchema, findCurrency };
export default currencySchema;