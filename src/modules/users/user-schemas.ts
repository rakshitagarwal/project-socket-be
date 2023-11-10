import { z } from "zod";
import { userImages, userImages1 } from "../../common/constants";
const OTP_TYPE = [
    "email_verification",
    "login_type",
    "forget_password",
] as const;
const register = z
    .object({
        first_name: z
            .string({ invalid_type_error: "first_name must be string" })
            .trim()
            .regex(/^[a-zA-Z0-9`]+(?:\s[a-zA-Z0-9`]+)*$/)
            .min(3)
            .optional(),
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
        last_name: z
            .string({ invalid_type_error: "last_name must be string" })
            .trim()
            .regex(/^[a-zA-Z0-9`]+(?:\s[a-zA-Z0-9`]+)*$/)
            .optional(),
        role: z.string({
            invalid_type_error: "role must be string",
            required_error: "role is required",
        }),
        country: z
            .string({
                invalid_type_error: "country must be string",
            })
            .optional(),
        mobile_no: z
            .string({ invalid_type_error: "mobile_no must be string" })
            .optional(),
        applied_referral: z
            .string()
            .optional(),
    })
    .strict();

const emailVerifcation = z
    .object({
        otp: z.string({
            invalid_type_error: "otp must be number",
            required_error: "otp is required",
        }),
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
        otp_type: z.enum(OTP_TYPE, {
            required_error: "otp_type is required",
            invalid_type_error: "otp_type must be string",
        }),
    })
    .strict();

const adminLogin = z
    .object({
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
        password: z.string({
            required_error: "password is required",
            invalid_type_error: "Password must be string",
        }),
    })
    .strict();

const login = z
    .object({
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
    })
    .strict();
const userId = z
    .object({
        id: z.string({
            required_error: "id is required",
            invalid_type_error: "id must be string",
        }),
    })
    .strict();

const updateUser = z
    .object({
        first_name: z
            .string({ invalid_type_error: "first_name must be string" })
            .trim()
            .regex(/^[a-zA-Z0-9`]+(?:\s[a-zA-Z0-9`]+)*$/)
            .min(3)
            .optional(),
        last_name: z
            .string({ invalid_type_error: "last_name must be string" })
            .trim()
            .regex(/^[a-zA-Z0-9`]+(?:\s[a-zA-Z0-9`]+)*$/)
            .optional(),
        mobile_no: z
            .string({ invalid_type_error: "mobile_no must be string" })
            .optional(),
        avatar: z.enum([...userImages, ...userImages1]).optional(),
    })
    .strict();

const refreshToken = z
    .object({
        refreshToken: z
            .string({
                required_error: "refresh_token is required",
                invalid_type_error: "refresh_token must be string",
            })
            .min(1),
    })
    .strict();

const updatePassword = z
    .object({
        otp: z.string({
            invalid_type_error: "otp must be string",
            required_error: "otp is required",
        }),
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
        newPassword: z.string({
            required_error: "newPassword is required",
            invalid_type_error: "newPassword must be string",
        }),
    })
    .strict();
const resetPassword = z
    .object({
        email: z
            .string({
                required_error: "email is required",
                invalid_type_error: "email must be string",
            })
            .email({ message: "Invalid email address" })
            .trim()
            .toLowerCase(),
        oldPassword: z.string({
            invalid_type_error: "oldPassword must be string",
            required_error: "oldPassword is required",
        }),
        newPassword: z.string({
            required_error: "newPassword is required",
            invalid_type_error: "newPassword must be string",
        }),
    })
    .strict();

const pagination = z
    .object({
        page: z
            .string({ invalid_type_error: "page must be string" })
            .optional(),
        limit: z
            .string({ invalid_type_error: "limit must be string" })
            .optional(),
        search: z
            .string()
            .regex(/^[a-zA-Z0-9._-]+(?:\s[a-zA-Z0-9._-]+)*$/)
            .optional(),
        _sort: z
            .enum([
                "first_name",
                "email",
                "country",
                "plays_in_wallet",
                "auction_won",
                "player_participated",
            ])
            .optional(),
        _order: z.enum(["asc", "desc"]).default("asc").optional(),
    })
    .strict();

const ZPlayerBalance = z.object({
    amount: z
        .number({
            required_error: "amount is required!",
            invalid_type_error: "amount should be number!",
        })
        .gt(0, {
            message: "amount should be greater than 0!",
        }),
    currency: z.enum(["FIAT", "CRYPTO"], {
        required_error: "currency is required!",
        invalid_type_error: "currency should be type of string!",
    }),
    currencyType: z.enum(["BIGTOKEN", "USDTERC20", "USDTRC20"], {
        required_error: "currencyType is required!",
        invalid_type_error: "currencyType should be type of string!",
    }),
    plays: z
        .number({
            required_error: "plays is required",
            invalid_type_error: "plays should be number",
        })
        .gt(0, {
            message: "plays should be greater than 0!",
        }),
    wallet_address: z
        .string({
            required_error: "wallet_address is required!",
            invalid_type_error: "wallet_address should be string!",
        })
        .regex(/^0x[a-fA-F0-9]{40}$/, {
            message: "wallet_address is not valid",
        }),
    transaction_hash: z
        .string({
            required_error: "transaction_hash is required!",
            invalid_type_error: "transaction_hash should be string!",
        })
        .regex(/^0x[a-f0-9]{64}$/, {
            message: "transaction_hash is not valid!",
        }),
    player_id: z
        .string({
            required_error: "player_id is required",
            invalid_type_error: "player_id must be string",
        })
        .uuid({
            message: "player_id is not proper",
        }),
});

const ZPlayerId = z.object({
    id: z
        .string({
            invalid_type_error: "ZPlayerId must be string!",
            required_error: "ZPlayerId is required!",
        })
        .uuid({
            message: "ZPlayerId not in a proper format!",
        }),
});

const ZPlayerEmail = z.object({
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "email must be string",
        })
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase()
});

const ZDeductPlays = z.object({
    plays: z.number({
        required_error: "plays ispend_ons required!",
        invalid_type_error: "plays type should be number!",
    }),
    player_id: z
        .string({
            invalid_type_error: "ZPlayerId must be string!",
            required_error: "ZPlayerId is required!",
        })
        .uuid({
            message: "ZPlayerId not in a proper format!",
        }),
});

const ZTransferPlays = z.object({
    id: z
        .string({
            invalid_type_error: "id must be string!",
            required_error: "id is required!",
        })
        .uuid({
            message: "id not in a proper format!",
        }),
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "email must be string",
        })
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(),
    plays: z
        .number({
            required_error: "plays is required!",
            invalid_type_error: "plays type should be number!",
        })
        .min(1),
});

const resendOtp = z.object({
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "email must be string",
        })
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(),
    otp_type: z.enum(OTP_TYPE, {
        required_error: "otp_type is required",
        invalid_type_error: "otp_type must be string",
    }),
});

const updateUserBlock = z
    .object({
        status: z
            .boolean({ invalid_type_error: "status must be string" })
            .optional(),
    })
    .strict();

const transactionHistoryPagination = z
    .object({
        page: z
            .string({ invalid_type_error: "page must be string" })
            .optional().default("0"),
        limit: z
            .string({ invalid_type_error: "limit must be string" })
            .optional().default("10"),
        spend_on: z
            .enum(["BUY_PLAYS",
                "REFUND_PLAYS",
                "BID_PLAYS",
                "REFERRAL_PLAYS",
                "AUCTION_REGISTER_PLAYS",
                "EXTRA_BIGPLAYS",
                "JOINING_BONUS",
                "TRANSFER_PLAYS",
                "RECEIVED_PLAYS"])
            .optional(),
    })
    .strict();
const userSchemas = {
    register,
    emailVerifcation,
    login,
    adminLogin,
    userId,
    updateUser,
    refreshToken,
    updatePassword,
    resetPassword,
    pagination,
    ZPlayerBalance,
    ZPlayerId,
    ZPlayerEmail,
    ZDeductPlays,
    ZTransferPlays,
    resendOtp,
    updateUserBlock,
    transactionHistoryPagination
};

export default userSchemas;
