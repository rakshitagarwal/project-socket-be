import { z } from "zod";

const ZAuctionAdd = z
    .object({
        title: z
            .string({
                required_error: "title is required!",
                invalid_type_error: "title should be string!",
            })
            .min(1, {
                message: "title should be of minimum 1 character!",
            }),
        description: z.string({
            required_error: "description is required!",
            invalid_type_error: "description should be string!",
        }),
        opening_price: z.number({
            required_error: "opening_price is required!",
            invalid_type_error: "description should be number!",
        }),
        price_increment: z.number({
            required_error: "price_increment is required!",
            invalid_type_error: "price_increment should be number!",
        }),
        play_consumed: z.number({
            required_error: "price_increment is required!",
            invalid_type_error: "price_increment should be number!",
        }),
        new_participant_threshold: z.number({
            required_error: "new_participant_threshold is required!",
            invalid_type_error: "new_participant_threshold should be number!",
        }),
        start_date: z.string({
            required_error: "start_date is required!",
            invalid_type_error: "start_date should be string!",
        }),
        is_pregistered: z
            .boolean({
                required_error: "is_pregistered is required!",
                invalid_type_error: "is_pregistered should be boolean!",
            })
            .default(false)
            .optional(),
        pre_register_count: z
            .number({
                required_error: "pre_register_count is required!",
                invalid_type_error: "pre_register_count should be number!",
            })
            .optional(),
        pre_register_fees: z
            .number({
                required_error: "pre_register_fees is required!",
                invalid_type_error: "pre_register_fees should be number!",
            })
            .optional(),
        terms_condition: z
            .string({
                required_error: "terms_condition is required!",
                invalid_type_error: "terms_condition should be boolean!",
            })
            .min(1)
            .optional(),
        auction_image: z
            .string({
                required_error: "auction_image is required!",
                invalid_type_error: "auction_image should be string!",
            })
            .uuid(),
        auction_video: z
            .string({
                required_error: "auction_video is required!",
                invalid_type_error: "auction_video should be string!",
            })
            .uuid(),
        auction_state: z
            .enum(["upcoming", "live", "compeleted"])
            .default("upcoming")
            .optional(),
        product_id: z
            .string({
                required_error: "product_id is required!",
                invalid_type_error: "product_id should be string!",
            })
            .uuid(),
        auction_category_id: z
            .string({
                required_error: "auction_category_id is required!",
                invalid_type_error: "auction_category_id should be string!",
            })
            .uuid(),
    })
    .strict();

const ZAuctionId = z.object({
    id: z
        .string({
            required_error: "id is required!",
            invalid_type_error: "id should be string!",
        })
        .uuid({
            message: "Auction Id should be UUID!",
        }),
});

const ZDeleteId = z.object({
    ids: z
        .array(
            z.string({
                required_error: "id is required!",
                invalid_type_error: "id should be string!",
            }),
            {
                required_error: "ids is required!",
                invalid_type_error: "ids should be array of string!",
            }
        )
        .min(1, {
            message: "minimum one Ids is required!",
        }),
});

export const auctionSchemas = {
    ZAuctionAdd,
    ZAuctionId,
    ZDeleteId,
};
