import z from "zod";

const IAuctionCategory = z.object({
    title: z.string({
        required_error: "title is required!",
        invalid_type_error: "title should be string!",
    }),
});

const IVerifyUUID = z.object({
    id: z
        .string({
            required_error: "id is required in the auction category!",
            invalid_type_error: "id should be string!",
        })
        .uuid({
            message: "uuid is not proper!",
        }),
});

const IPutAuctionCategory = z.object({
    title: z
        .string({
            required_error: "title is required!",
            invalid_type_error: "title should be string!",
        })
        .optional(),
    status: z
        .boolean({
            required_error: "status is required!",
            invalid_type_error: "title should be boolean!",
        })
        .optional(),
});

export const auctionCategorySchemas = {
    IAuctionCategory,
    IPutAuctionCategory,
    IVerifyUUID,
};
