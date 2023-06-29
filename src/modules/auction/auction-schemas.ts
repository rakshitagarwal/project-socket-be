import { z } from "zod";

const ZAuctionAdd = z.object({
    title: z.string({
        required_error: "title is required!",
        invalid_type_error: "title should be string!",
    }),
    description: z.string({
        required_error: "description is required!",
        invalid_type_error: "description should be string!",
    }),
    opening_price: z.number({
        required_error: "opening_price is required!",
        invalid_type_error: "description should be string!",
    }),
});

export const auction = {
    ZAuctionAdd,
};
