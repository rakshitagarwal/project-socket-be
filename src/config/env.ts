import "dotenv/config";
import { z } from "zod";

/**
 * @description Environment variables configurations
 */
const envSchema = z.object({
    PORT: z.preprocess(
        (x) => +(x as string),
        z.number({
            required_error: "PORT must be present in environment variables",
            invalid_type_error: "Invalid PORT in environment variables",
        })
    ),
    DATABASE_URL: z.string({
        required_error: "DATABASE_URL must be present in environment variable",
    }),
    REDIS_PORT: z.preprocess(
        (x) => +(x as string),
        z.number({
            required_error:
                "REDIS_PORT must be present in environment variables",
            invalid_type_error: "Invalid REDIS_PORT in environment variables",
        })
    ),
    REDIS_HOST: z.string({
        required_error: "REDIS_HOST must be present in environment variable",
    }),
    LOG_DIR: z.string({
        required_error: "LOG_DIR must be present in environment variable",
    }),
    JWT_ACCESS_TOKEN_EXPIRED: z.string({
        required_error:
            "JWT_ACCESS_TOKEN_EXPIRED must be present in environment variable",
    }),
    JWT_REFRESH_TOKEN_EXPIRED: z.string({
        required_error:
            "JWT_REFRESH_TOKEN_EXPIRED must be present in environment variable",
    }),
    API_VERSION: z.string({
        required_error: "API_VERSION must be present in environment variable",
    }),
    NODE_ENV: z.string({
        required_error: "NODE_ENV must be present in environment variable",
    }),
    EMAIL_HOST: z.string({
        required_error: "EMAIL_HOST must be present in environment variable",
    }),
    EMAIL_PORT: z.preprocess(
        (x) => +(x as string),
        z.number({
            required_error: "EMAIL_PORT must be present in environment variables",
            invalid_type_error: "Invalid EMAIL_PORT in environment variables",
        })
    ),
    FROM_EMAIL: z.string({
        required_error: "FROM_EMAIL must be present in environment variable",
    }),
    EMAIL_PASSWORD: z.string({
        required_error: "EMAIL_PASSWORD must be present in environment variable",
    }),
    EMAIL_SERVICE: z.string({
        required_error: "EMAIL_SERVICE must be present in environment variable",
    }),
    SENDGRID_API_KEY:z.string({
        required_error: "SENDGRID_API_KEY must be present in environment variable",
    })
});

const env = Object.freeze(envSchema.parse(process.env));
export default env;
