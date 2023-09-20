import { z } from "zod";

const uuidSchema = z
    .object({
        id: z.string().uuid(),
    })
    .strict();

const requestBodySchema = z
    .object({
        bid_increment: z.number({
            invalid_type_error: "bid_increment should be number",
        }),
        big_token: z.number({
            invalid_type_error: "big_token should be number",
        }),
        usdt: z.number({
            invalid_type_error: "usdt should be number",
        }),
        usdc: z.number({
            invalid_type_error: "usdc should be number",
        }),
    })
    .strict();

const findCurrency = z
    .object({
        currency_code: z.string().length(3).optional(),
    })
    .strict();

const currencySchema = { uuidSchema, requestBodySchema, findCurrency };
export default currencySchema;
