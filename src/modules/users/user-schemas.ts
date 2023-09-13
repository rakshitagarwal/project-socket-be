import { z } from "zod";
const OTP_TYPE = [
    "email_verification",
    "login_type",
    "forget_password",
] as const;
const register = z
    .object({
        first_name: z
            .string({ invalid_type_error: "first_name must be string" })
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
            .string({ invalid_type_error: "applied referral must be string" })
            .min(7)
            .optional(),
    })
    .strict();

const emailVerifcation = z
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
            .optional(),
        last_name: z
            .string({ invalid_type_error: "last_name must be string" })
            .optional(),
        mobile_no: z
            .string({ invalid_type_error: "mobile_no must be string" })
            .optional(),
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
            .regex(/^[a-zA-Z0-9._-]+$/)
            .optional(),
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

const ZDeductPlays = z.object({
    plays: z.number({
        required_error: "plays is required!",
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

const countries = z.object({
    name: z
        .string({
            required_error: "name is required",
            invalid_type_error: "name must be string",
        })
        .trim()
        .optional(),
    code: z
        .string({
            required_error: "code is required",
            invalid_type_error: "code must be string",
        })
        .trim()
        .optional(),
});

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
    ZDeductPlays,
    resendOtp,
    countries,
};

export default userSchemas;
