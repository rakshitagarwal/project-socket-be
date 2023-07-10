import { z } from "zod";
import { AUCTION_STATE } from "../../common/constants";

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
        start_date: z.coerce.date().refine((data) => data > new Date(), {
            message: "Start date must be in the future",
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
        auction_state: z.enum(AUCTION_STATE, {
            invalid_type_error: "auction_state should be string!",
            required_error: "auction_state is required!",
        }),
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

const Zpagination = z
    .object({
        page: z
            .preprocess(
                (val) => parseInt(val as string),
                z.number({ invalid_type_error: "page must be number" })
            )
            .default(0),
        limit: z
            .preprocess(
                (val) => parseInt(val as string),
                z.number({ invalid_type_error: "limit must be number" })
            )
            .default(10),
        search: z
            .string()
            .regex(/^[a-zA-Z0-9._-]+$/)
            .optional(),
    })
    .strict();

export const auctionSchemas = {
    ZAuctionAdd,
    ZAuctionId,
    ZDeleteId,
    Zpagination,
};
