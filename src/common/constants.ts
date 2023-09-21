export const ENDPOINTS = {
    BASE: "/",
    DOCS: "/docs",
    AUCTIONS: "/auction",
    PRODUCT_CATEGORY: "/product-category",
    UPLOADS: "/assets/uploads",
    AUCTION_CATEGORY: "/auction-category",
    ROLE: "/role",
    USERS: "/user",
    LOGIN: "/login",
    REGISTER: "/register",
    ADMIN_LOGIN: "/admin/login",
    LOGOUT: "/logout",
    RESET_PASSWORD: "/reset-password",
    FORGET_PASSWORD: "/forget-password",
    UPDATE_PASSWORD: "/update-password",
    REFRESH_TOKEN: "/refresh-token",
    VERIFY: "/verify",
    ID: "/:id",
    PRODUCT: "/product",
    BIDBOT: "/bidbot",
    ADD_PLAYS: "add/plays",
    TERM_CONDITION: "/term-condition",
    MEDIA: "/media",
    BALANCE: "wallet/balance/:id",
    PLAYER_AUCTION_REGISTER: "player/register",
    DEDUCT_PLAYS: "deduct/plays",
    PLAYER_AUCTION_ID: "/player-auction/:id",
    PLAYER_AUCTION: "/player/auction/result",
    PAY_NOW: "product/purchase",
    ASSETS: "/assets/",
    AUCTION_LISTING: "list/",
    REFERRAL: "/referral",
    COUNTRIES: "/countries/list",
    REFERRAL_CONFIG: "config",
    MULTIPLE: "multiple",
    RESEND_OTP: "/resend-otp",
    CURRENT_LOCATION: "/current/address",
    LOCATION: "/location",
    CURRENCY: "/currency",
    AUCTION_TOTAL_LIST: 'stats/list',
    AUCTION_TOTAL: "total-auction/list",
    USER_BLOCK: "block/"

};
export const ALLOWED_MIMETYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
];

export const ALLOWED_IMAGE_MIMETYPES = ["image/png", "image/jpg", "image/jpeg"];
export const productCategoryMessage = {
    ADD: {
        SUCCESS: "product category add success",
        ALREADY_EXIST: "product category title already exist",
    },
    GET: {
        REQUESTED: "get product category requested!",
        ALL: "get all product category !",
        NOT_FOUND: "product category id not found",
    },
    UPDATE: {
        SUCCESS: "product category update success",
    },
    DELETE: {
        SUCCESS: "product category delete",
    },
};
export const AUCTION_CATEGORY_MESSAGES = {
    ADD: "auctionCategory created!",
    NOT_EXISTS: "auctionCategory id not found!",
    UPDATE: "auctionCategory updated!",
    NOT_FOUND: "auctionCategory not found!",
    GET_SINGLE: "auctionCategory found!",
    DELETE: "auctionCategory deleted!",
};

export const AUCTION_MESSAGES = {
    CREATE: "auction created!",
    NOT_FOUND: "auction not found!",
    NOT_CREATED: "auction not created!, something went wrong",
    FOUND: "auction found!",
    UPDATE: "auction updated!",
    REMOVE: "auction deleted!",
    NOT_ACTIVE: "auction not active",
    PRE_REGISTER_ERROR: "This is open auction, cannot be registered",
    PLAYER_COUNT_NOT_REACHED: "player registeration count not reached",
    AUCTION_ALREADY_STARTED:
        "auction is live,so you can't update the auction detials!",
    AUCTION_LIVE_DELETE: "auction is live, so you cannot delete!",
    AUCTION_LIVE_UPDATE: "auction is live, so you cannot update!",
    AUCTION_COMPLETED_DELETE: "auction is completed, so you cannot delete!",
    AUCTION_COMPLETED_UPDATE: "auction is completed, so you cannot update!",
    SOMETHING_WENT_WRONG: "can't start auction, something went wrong!",
    CANNOT_DELETE_AUCTION: "something went wrong",
    DATE_NOT_PROPER: "start_date should be greater than current date!",
    AUCTION_ALREADY_SET: "cannot update start date already added!",
    BOT_SIMULATION_NOT_LIVE: "auction is not live, so simulation cannot start",
    SIMULATION_STARTED: "simulation started",
    SIMULATION_STOPPED: "simulation stopped",
    GET_BID_LOGS: "All BigLogs",
    BID_LOGS_NOT_FOUND: "BidLogs not found",
};

export const productMessage = {
    ADD: {
        SUCCESS: "product add success",
        ALREADY_EXIST: "product title already exist",
        PRODUCT_ADDED_WITH_AUCTION:
            "Cannot delete product is bind with auction",
    },
    GET: {
        REQUESTED: "get product requested!",
        ALL: "get all product !",
        NOT_FOUND: "product Id not found!",
        SOME_NOT_FOUND: "some product, or product media or media id not found!",
        PRODUCT_MEDIA_NOT_FOUND: "Product Media not found!",
        PRODUCT_MEDIA_IDS: "product media ids not exists!",
    },
    UPDATE: {
        SUCCESS: "product update success",
        TRANSACTION_FAIL:
            " Prisma has failed due to a conflict between two or more transactions",
    },
    DELETE: {
        SUCCESS: "product removal success",
        FAIL: "product removal failed",
    },
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP: "login_otp.html",
    FORGET_PASSWORD: "forget_password.html",
    PLAYER_REGISTERATION: "auction_player_registration.html",
    PLAYER_AUCTION_REGISTER: "player_auction_register.html",
    REGISTER_PRE_ADMIN: "registration_per_admin.html",
};

export const OTP_TYPE = {
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type",
    FORGET_PASSWORD: "forget_password",
};

export const MESSAGES = {
    TRANSACTION_CRYPTO: {
        NOT_CREATED: "transaction not created!",
        CREATED_SUCCESS: "transaction created successfully!",
        GET_NOW_EXPIRED: "product purchase time has expired!",
        AUCTION_NOT_COMPELETED: "auction is not completed!",
        ALREADY_PURCHASE_PRODUCT: "You have already purchased the product",
    },
    SOCKET: {
        TOTAL_AUCTION_REGISTERED: "total auction registered",
        AUCTION_LIVE: "Auction live",
        AUCTION_BUY_NOW: "Auction buy now",
        AUCTION_WINNER: "Auction winner",
        AUCTION_CLOSED: "Auction Ended",
        AUCTION_COUNT_DOWN: "Auction timer countdown",
        AUCTION_RECENT_BID: "Auction recent bid",
        RECENT_BIDS: "Recent bids history",
        AUCTION_ENDED: "Auction ended",
        CURRENT_PLAYS: "Current plays",
        AUCTION_NOT_FOUND: "Auction not found",
        USER_NOT_REGISTERED: "User not registered",
        CONTINUE_BID_NOT_ALLOWED: "Continued bid is not allowed",
        INSUFFICIENT_PLAYS_BALANCED: "Insufficient PLAY balance",
        BUY_NOW: "Buy now",
        AUCTION_NOT_LIVE: "Auction not live",
    },
    OTP: {
        INVALID_OTP: "Invalid otp",
    },
    USERS: {
        CHECK_MAIL: "please check your email",
        USER_LOGIN: "login successful!",
        USER_LOGOUT: "Logged out successfully",
        USER_NOT_FOUND: "Account not found. Please sign-up to login.",
        USER_EXIST: "user already exists",
        INVALID_CREDENTIAL: "invalid credentials",
        ADMIN_EXIST: "admin already exists",
        USER_VERIFIED: "user verified",
        VERIFICATION_ERROR: "Please verify your email",
        USER_FOUND: "user found successfully",
        PASSWORD_UPDATED: "password updated",
        WRONG_PASSWORD: "Invalid old password",
        UPDATE_USER: "user updated successfully",
        USER_DELETED: "user deleted",
        SIGNUP: "Registered successfully!",
        PLAYER_NOT_REGISTERED: "You are not registered",
        CHECK_YOUR_EMAIL_VERIFY_ACCOUNT:
            "Please check your email and verify your account!",
        PLEASE_VERIFY_YOUR_EMAIL: "Please verify your account!",
        USER_TEMPORARY_BLOCK: "Your account is temporarily blocked. Please contact customer service.",
    },
    ROLE: {
        ROLE_EXIST: "admin already exists",
        FOUND_ROLE: "role found successfully",
        ROLE_ADDED: "role added successfully",
        ROlE_NOT_EXIST: "role not found",
    },
    MEDIA: {
        REQUEST_MEDIA: "requested media",
        MEDIA_NOT_ATTACHED: "media file not attached or not acceptable",
        MEDIA_ID: "media id not provided",
        MEDIA_CREATE_FAIL: "media creation fail",
        MEDIA_DELETE_SUCCESS: "media deleted successfully",
        MEDIA_DELETE_FAIL: "media delete failed",
        MEDIA_CREATE_SUCCESS: "media created successfully",
        MEDIA_STATUS_CHANGE_SUCCESS: "media status changed successfully",
        MEDIA_SINGLE_INVALID: "Please select only one media file",
        MEDIA_FILES_INVALID: "media files invalid",
        MEDIA_NOT_ALLOWED:
            "Please select minimum 5 supported media files",
        MEDIA_MIN_ID: "at least one media id should be provided",
        MEDIA_NOT_FOUND: "media id not found or not valid",
        MEDIA_IDS_NOT_FOUND: "some media ids were not found",
        AUCTION_IMAGE_NOT_FOUND: "auction image not found!",
        AUCTION_VIDEO_NOT_FOUND: "auction video not found!",
    },
    REFERRAL: {
        REFERRAL_FOUND: "Referral code found successfully",
        REFERRAL_NOT_FOUND: "Referral code not found",
        REFERRAL_CONFIG_FOUND: "Referral config found successfully",
        REFERRAL_CONFIG_NOT_FOUND: "Referral config not found",
        REFERRAL_CONFIG_UPDATED: "Referral config updated successfully",
        REFERRAL_CONFIG_NOT_UPDATED: "Referral config not updated",
        REFERRAL_NOT_VALID: "referral code is invalid",
    },
    CURRENCY: {
        CURRENCY_FOUND: "Currency found",
        CURRENCY_NOT_FOUND: "Currency not found",
        CURRENCY_ALL: "All currencies",
        CURRENCY_UPDATED: "Updated currency config",
        CURRENCY_NOT_UPDATED: "Updated currency config",
        CURRENCY_UPDATE_FAILED: "You cannot update currency when an auction is LIVE or UPCOMING",
        CURRENCY_DEFAULT_VALUE: 0.20,
    },
    BIDBOT: {
        BIDBOT_CREATE_SUCCESS: "Bidbot created successfully",
        BIDBOT_FOUND: "Bidbot found successfully",
        BIDBOT_CREATE_FAIL: "Bidbot creation failed",
        BIDBOT_NOT_FOUND: "Bidbot not found or id not valid",
        BIDBOT_UPDATE_LIMIT: "Bidbot limit updated successfully",
        BIDBOT_ACTIVE: "Bidbot active",
        BIDBOT_ACTIVATED: "Bidbot activated",
        BIDBOT_ALREADY_ACTIVE: "Bidbot already active",
        BIDBOT_NOT_ACTIVE: "Bidbot not active",
        BIDBOT_DEACTIVATED: "Bidbot Deactivated",
        BIDBOT_DATA_EMPTY: "No existing bot data found for auction ID",
        BIDBOT_PLAYS_LIMIT: "Bidbot plays limit reached",
        BITBOT_PLAYS_REQUIRED: "plays limit is required",
        BIDBOT_PLAYS_NEGATIVE: "plays limit should be valid i.e. more than 0",
        BIDBOT_PRICE_NEGATIVE: "price limit can't be negative or less than 1",
        BIDBOT_PRICE_REACHED: "auction price already crossed price limit",
        BIDBOT_PRICE_GREATER: "bid price should be less than product price",
        BIDBOT_WALLET_INSUFFICIENT: "wallet balance insufficient",
    },
    ALL: {
        MULTER_ERROR: "multer error",
        COUNTRY: "country details ",
        IP_ADDR_NOT_FOUND: "Cannot fetch IP address",
        CURRENT_LOCATION: "Get Current Location",
        LOCATION_NOT_FOUND: "Cannot get the location",
    },
    JWT: {
        JWT_EXPIRED: "jwt expired",
        JWT_NOT_ACTIVE: "jwt not active",
        JWT_MALFORMED: "jwt malformed",
        TOKEN_NOT_FOUND: "token not found",
        TOKEN_NOT_EXPIRED: "token not expired",
        DATA_FOUND: "data found",
        UNAUTHORIZED: "unauthorized",
    },
    TERM_CONDITION: {
        CREATED: "term and condition added successfully!",
        UPDATED: "term and condition updated successfully!",
        DELETED: "term and condition deleted successfully!",
        NOT_FOUND: "term and condition not found!",
        FOUNDED: "term and condition found successfully!",
        INACTIVE_STATUS: "status is not active",
        CONFLICT: "term and condition already exists",
    },
    USER_PLAY_BALANCE: {
        PLAYER_BALANCE: "player play balances",
        PLAYER_NOT_FOUND: "player not found!",
        PLAY_BALANCE_CREDITED: "player balance credited!",
        PLAY_BALANCE_NOT_CREDITED:
            "player balance not added, something went wrong!",
        USER_IS_NOT_PLAYER: "user is not a player!",
        USER_WALLET_BALANCE_NOT_FOUND: "wallet balance not found!",
    },
    PLAYER_WALLET_TRAX: {
        PLAYER_TRAX_NOT_FOUND: "transaction not found in wallet!",
        INSUFFICIENT_PLAY_BALANCE: "insufficient play balance!",
        PLAYS_NOT_DEBITED: "plays not debited!",
        PLAYS_SUCCESSFULLY_DEBITED: "plays debited successfully!",
        TRANSACTION_FAILED: "transaction failed!",
    },
    PLAYER_AUCTION_REGISTEREATION: {
        PLAYER_REGISTERED: "you are registered in auction!",
        PLAYER_NOT_REGISTERED: "you are not registered!",
        PLAYER_ALREADY_EXISTS: "player already exists in auction!",
    },
};

export const SOCKET_EVENT = {
    AUCTION_WINNER: "auction:winner",
    AUCTION_COUNT_DOWN: "auction:count:down",
    AUCTION_RECENT_BID: "auction:recent:bid",
    AUCTION_BIDS: "auction:bid:history",
    AUCTION_ERROR: "auction:error",
    AUCTION_CURRENT_PLAYS: "auction:current:play",
    AUCTION_STATE: "auction:state",
    AUCTION_REGISTER_COUNT: "auction:register:count",
    AUCTION_RUNNER_UP: "auction:runner:up",
    AUCTION_BIDBOT: "auction:bidbot",
    BIDBOT_ERROR: "bidbot:error",
    BIDBOT_DEACTIVATE: "auction:bidbot:deactivate",
    BIDBOT_LIMIT_REACH: "auction:bidbot:limit:reach",
    BIDBOT_STATUS: "bidbot:status",
    BIDBOT_SESSION_STATUS: "session:bidbot:status",
    AUCTION_START_DATE: "auction:start:date",
};

export const NODE_EVENT_SERVICE = {
    MIN_MAX_AUCTION_END: "min:max:auction:end",
    USER_MAIL: "send:user:mail",
    AUCTION_STATE_UPDATE: "auction:state:update",
    AUCTION_REMINDER_MAIL: "auction:reminder:mail",
    AUCTION_CLOSED: "auction:closed",
    AUCTION_REGISTER_COUNT: "auction:register:count",
    UPDATE_PLAYER_REGISTER_STATUS: "auction:player:register:status",
    COUNTDOWN: "auction:countdown",
    DELETE_PRODUCT_MEDIA_IMAGES: "product:media:delete",
    PLAYER_PLAYS_BALANCE_CREDITED: "auction:player:balance:credit",
    PLAYER_PLAYS_BALANCE_DEBIT: "auction:player:balance:debit",
    START_SIMULATION_LIVE_AUCTION: "start:simulation:auction",
    MULTIPLE_PLAYER_PLAY_BALANCE_CREDIED:
        "multiple:player:playbalance:credited",
    SIMULATION_BOTS: "simulation:bots",
    STOP_BOT_SIMULATIONS: "stop:bot:simulations",
    PLAYER_AUCTION_REGISTER_MAIL: "player:register:mail",
    REGISTER_NEW_PLAYER: "register:new:player"
};

export const AUCTION_STATE = [
    "upcoming",
    "live",
    "completed",
    "cancelled",
] as const;

export const AUCTION_CATEGORY = [
    {
        title: "THE LAST PLAY",
        code: "TLP",
    },
    {
        title: "Lowest Unique Bid",
        code: "MIN",
    },
    {
        title: "Highest Unique Bid",
        code: "MAX",
    },
];

export const dateFormateForMail = (start_date: string) => {
    const startDateISOString = new Date(start_date).toISOString();
    const currentDateISOString: string = new Date().toISOString();
    const startDate: Date = new Date(startDateISOString);
    const currentDate: Date = new Date(currentDateISOString);
    const timeDifferenceMs: number =
        currentDate.getTime() - startDate.getTime();
    const hours: number = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutes: number = Math.floor(
        (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds: number = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
};

export const ONE_PLAY_VALUE_IN_DOLLAR = 0.1;

