import z from "zod";

const UUID = z
    .string({
        required_error: "id is required in the auction category!",
        invalid_type_error: "id should be string!",
    })
    .uuid({
        message: "uuid is not proper!",
    });

const ZAuctionCategory = z.object({
    title: z.string({
        required_error: "title is required!",
        invalid_type_error: "title should be string!",
    }),
});

const ZVerifyUUID = z.object({
    id: UUID,
});

const ZPutAuctionCategory = z.object({
    title: z
        .string({
            required_error: "title is required!",
            invalid_type_error: "title should be string!",
        })
        .optional(),
    status: z
        .boolean({
            required_error: "status is required!",
            invalid_type_error: "status should be boolean!",
        })
        .optional(),
});

const ZDelete = z.object({
    ids: z
        .array(UUID, {
            required_error: "ids is required!",
            invalid_type_error: "ids should be string!",
        })
        .min(1, {
            message: "minimum 1 Id is required!",
        }),
});

const ZSearch = z.object({
    search: z
        .string({
            required_error: "ids is required!",
            invalid_type_error: "ids should be string!",
        })
        .default(""),
});

export const auctionCategorySchemas = {
    ZAuctionCategory,
    ZPutAuctionCategory,
    ZVerifyUUID,
    ZDelete,
    ZSearch,
};
