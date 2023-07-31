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
        play_consumed: z.number({
            required_error: "price_increment is required!",
            invalid_type_error: "price_increment should be number!",
        }),
        new_participant_threshold: z
            .number({
                required_error: "new_participant_threshold is required!",
                invalid_type_error:
                    "new_participant_threshold should be number!",
            })
            .min(1, { message: "minmum should be 1%" })
            .max(100, { message: "maximum should be 100%" })
            .optional(),
        start_date: z.coerce
            .date()
            .refine((data) => data > new Date(), {
                message: "Start date must be in the future",
            })
            .optional(),
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
        auction_state: z
            .enum(AUCTION_STATE, {
                invalid_type_error: "auction_state should be string!",
                required_error: "auction_state is required!",
            })
            .optional(),
        status: z.boolean().optional(),
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

const ZbidAuction = z
    .object({
        auction_id: z
            .string({
                required_error: "Auction Id is required!",
                invalid_type_error: "Auction Id should be string!",
            })
            .uuid({ message: "Auction Id should be UUID!" }),
        player_id: z
            .string({
                required_error: "player Id is required!",
                invalid_type_error: "player Id should be string!",
            })
            .uuid({ message: "player Id should be UUID!" }),
        remaining_seconds: z.preprocess(
            (val) => parseInt(val as string),
            z.number({
                invalid_type_error: "remaining_seconds must be number",
                required_error: "remaining_seconds is required!",
            })
        ),
        player_name: z.string({
            required_error: "playerName is required!",
            invalid_type_error: "playerName should be string!",
        }),
        profile_image: z.string({
            required_error: "profileImage is required!",
            invalid_type_error: "profileImage should be string!",
        }),
        player_bot_id: z
            .string({
                required_error: "player_bot_id is required!",
                invalid_type_error: "player_bot_id should be string!",
            })
            .uuid({ message: "player_bot_id should be UUID!" })
            .optional(),
    })
    .strict();

const ZPlayerRegister = z
    .object({
        player_id: z
            .string({
                required_error: "player_id is required!",
                invalid_type_error: "player_id should be string!",
            })
            .uuid({
                message: "player_id should be UUID",
            }),
        auction_id: z
            .string({
                required_error: "auction_id is required!",
                invalid_type_error: "auction_id should be string!",
            })
            .uuid({
                message: "auction_id should be UUID",
            }),
        player_wallet_transaction_id: z
            .string({
                required_error: "player_id is required!",
                invalid_type_error: "player_id should be string!",
            })
            .uuid({
                message: "player_wallet_transaction_id should be UUID",
            }),
    })
    .strict();

const ZStartAuction = z.object({
    auction_id: z
        .string({
            required_error: "auction_id is required!",
            invalid_type_error: "auction_id should be string!",
        })
        .uuid({
            message: "auction_id should be UUID",
        }),
    start_date: z.coerce.date({
        required_error: "start_date is required!",
        invalid_type_error: "start_date should be  date!",
    }),
});

export const auctionSchemas = {
    ZAuctionAdd,
    ZAuctionId,
    ZDeleteId,
    Zpagination,
    ZbidAuction,
    ZPlayerRegister,
    ZStartAuction,
};
