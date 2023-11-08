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
    TRANSFER_PLAYS: "transfer/plays",
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
    AUCTION_TOTAL_LIST: "stats/list",
    AUCTION_TOTAL: "total-auction/list",
    USER_BLOCK: "block/:id",
    GRID_LIVE_UPCOMING: "/grid/list",
    PLAYER_TRANSACTION: "/player-transaction/:id",
    PLAYER_IMAGE: "/avatar",
    CANCEL: "/cancel",
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
        SUCCESS: "Product Category Created",
        ALREADY_EXIST: "Product category already exist",
    },
    GET: {
        REQUESTED: "Product Category Found!",
        ALL: "All Product Categories!",
        NOT_FOUND: "Product category not found",
    },
    UPDATE: {
        SUCCESS: "Product Category Updated",
    },
    DELETE: {
        SUCCESS: "Product Category Deleted",
    },
};
export const AUCTION_CATEGORY_MESSAGES = {
    ADD: "Auction Category Created!",
    NOT_EXISTS: "Auction category id not found!",
    UPDATE: "Auction Category Updated!",
    NOT_FOUND: "Auction category not found!",
    GET_SINGLE: "Auction Category Found!",
    DELETE: "Auction Category Deleted!",
};

export const AUCTION_MESSAGES = {
    CREATE: "Auction Created!",
    NOT_FOUND: "Auction not found!",
    NOT_CREATED: "Auction not created!, something went wrong",
    FOUND: "Auction Found!",
    UPDATE: "Auction Updated!",
    REMOVE: "Auction Deleted!",
    NOT_ACTIVE: "Auction not active",
    CANCELLED: "Auction Cancelled Successfully!",
    CANT_CANCEL: "Auction can't be cancelled",
    PRE_REGISTER_ERROR:
        "This Is An Open Auction, Registeration Not Applicable!",
    PLAYER_COUNT_NOT_REACHED: "Player registeration count not reached",
    AUCTION_ALREADY_STARTED:
        "Auction is live, You can't update this auction detials!",
    AUCTION_LIVE_DELETE: "Auction is live, you can't delete!",
    AUCTION_LIVE_UPDATE: "Auction is live, you can't update!",
    AUCTION_COMPLETED_DELETE: "Auction is completed, you can't delete!",
    AUCTION_COMPLETED_UPDATE: "Auction is completed, you can't update!",
    SOMETHING_WENT_WRONG: "Can't start this auction, something went wrong!",
    CANNOT_DELETE_AUCTION: "Something went wrong",
    DATE_NOT_PROPER: "Start date should be greater or equal to current date!",
    AUCTION_ALREADY_SET: "Can't update as start date already added!",
    BOT_SIMULATION_NOT_LIVE: "Auction is not live, simulation can't start",
    SIMULATION_STARTED: "Simulation Started",
    SIMULATION_STOPPED: "Simulation Stopped",
    GET_BID_LOGS: "All BigLogs",
    BID_LOGS_NOT_FOUND: "BidLogs not found",
    ALREADY_EXIST: "Auction category already exist",
    TOTAL_BID_DECIMAL_VALUE:"total_bids and decimal_count are required!",
};

export const productMessage = {
    ADD: {
        SUCCESS: "Product Added Successfully",
        ALREADY_EXIST: "Product title already exist",
        PRODUCT_ADDED_WITH_AUCTION:
            "Cannot delete product as its binded with some auction",
    },
    GET: {
        REQUESTED: "Product Requested!",
        ALL: "All Products!",
        NOT_FOUND: "Product id not found!",
        SOME_NOT_FOUND: "Some product, product media or media not found!",
        PRODUCT_MEDIA_NOT_FOUND: "Product media not found!",
        PRODUCT_MEDIA_IDS: "Product media ids don't exist!",
    },
    UPDATE: {
        SUCCESS: "Product Update Successfully",
        IN_AUCTIONS: "Update failed. product already exists in some auction",
        STATUS_CHANGED: "Product Status Changed",
        STATUS_NOT_CHANGED: "Product status not changed",
        TRANSACTION_FAIL:
            " Prisma has failed due to some conflict between two or more transactions",
    },
    DELETE: {
        SUCCESS: "Product Deleted Successfully",
        FAIL: "Product delete failed",
    },
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP: "login_otp.html",
    FORGET_PASSWORD: "forget_password.html",
    PLAYER_REGISTERATION: "auction_reminder.html",
    PLAYER_AUCTION_REGISTER: "auction_register.html",
    REGISTER_PRE_ADMIN: "registration_per_admin.html",
    WINNER:"winner.html"
};

export const OTP_TYPE = {
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type",
    FORGET_PASSWORD: "forget_password",
};

export const MESSAGES = {
    TRANSACTION_HISTORY: {
        FIND: "Transactions History",
    },
    TRANSACTION_CRYPTO: {
        NOT_CREATED: "Transaction not created!",
        CREATED_SUCCESS: "Transaction Created Successfully!",
        GET_NOW_EXPIRED: "Product purchase time expired!",
        AUCTION_NOT_COMPELETED: "Auction is not completed!",
        ALREADY_PURCHASE_PRODUCT: "You have already purchased the product",
    },
    SOCKET: {
        TOTAL_AUCTION_REGISTERED: "Total players registered on auction",
        AUCTION_LIVE: "Auction live",
        AUCTION_BUY_NOW: "Auction buy now",
        AUCTION_WINNER: "Auction winner",
        AUCTION_CLOSED: "Auction ended",
        AUCTION_COUNT_DOWN: "Auction timer countdown",
        AUCTION_RECENT_BID: "Auction recent bid",
        RECENT_BIDS: "Recents bids history",
        ACTIVE_PLAYERS: "Active players' avatars",
        AUCTION_ENDED: "Auction ended",
        CURRENT_PLAYS: "Current PLAYS",
        AUCTION_NOT_FOUND: "Auction not found",
        USER_NOT_REGISTERED: "You are not registered in this auction",
        CONTINUE_BID_NOT_ALLOWED: "Continued bid not allowed",
        INSUFFICIENT_PLAYS_BALANCED: "Insufficient PLAYS balance",
        BUY_NOW: "Buy now",
        AUCTION_NOT_LIVE: "Auction not live",
        NEW_AUCTION_ADDED: "New auction added",
    },
    OTP: {
        INVALID_OTP: "Invalid OTP",
    },
    USERS: {
        CHECK_MAIL: "Please Check Your Email",
        USER_LOGIN: "Login Successful!",
        USER_LOGOUT: "Logged Out Successfully",
        USER_NOT_FOUND: "Account not found. please sign-up to login.",
        USER_EXIST: "This email address already exists. please login",
        INVALID_CREDENTIAL: "Invalid credentials",
        ADMIN_EXIST: "Admin already exists",
        USER_VERIFIED: "User Verified",
        VERIFICATION_ERROR: "Please Verify Your Email",
        USER_FOUND: "User Found Successfully",
        INVALID_PLAYS: "PLAYS cannot be in decimal",
        EMAIL_BLOCKED_INVALID:
            "Cannot transfer PLAYS as player doesn't exist or is blocked",
        INVALID_TRANSFER:
            "You are not allowed to transfer PLAYS to your own account",
        INSUFFICIENT_BALANCE: "Your PLAYS balance is insufficient for transfer",
        ID_NOT_FOUND: "User id not found",
        PASSWORD_UPDATED: "Password Updated",
        WRONG_PASSWORD: "Invalid old password",
        UPDATE_USER: "Profile Details Updated Successfully",
        USER_DELETED: "User Deleted",
        SIGNUP: "Registered Successfully!",
        PLAYER_NOT_REGISTERED: "You are not registered",
        CHECK_YOUR_EMAIL_VERIFY_ACCOUNT:
            "Please Check Your Email And Verify Your Account!",
        PLEASE_VERIFY_YOUR_EMAIL: "Please Verify Your Account!",
        USER_TEMPORARY_BLOCK:
            "Your account is temporarily blocked. please contact customer service.",
        AVATAR: "User Avatar's",
    },
    ROLE: {
        ROLE_EXIST: "Admin already exists",
        FOUND_ROLE: "Role Found Successfully",
        ROLE_ADDED: "Role Added Successfully",
        ROlE_NOT_EXIST: "Role not found",
    },
    MEDIA: {
        REQUEST_MEDIA: "Requested Media",
        MEDIA_NOT_ATTACHED: "Media file not attached or not acceptable",
        MEDIA_ID: "Media id not provided",
        MEDIA_CREATE_FAIL: "Media creation failed",
        MEDIA_DELETE_SUCCESS: "Media Deleted Successfully",
        MEDIA_DELETE_FAIL: "Media delete failed",
        MEDIA_CREATE_SUCCESS: "Media Created Successfully",
        MEDIA_STATUS_CHANGE_SUCCESS: "Media Status Changed Successfully",
        MEDIA_SINGLE_INVALID: "Please select only one media file",
        MEDIA_FILES_INVALID: "Media files invalid",
        MEDIA_NOT_ALLOWED: "Please select minimum 5 supported media files",
        MEDIA_MIN_ID: "Atleast one media id should be provided",
        MEDIA_NOT_FOUND: "Media id not found or invalid",
        MEDIA_IDS_NOT_FOUND: "Some media ids are not found",
        AUCTION_IMAGE_NOT_FOUND: "Auction image not found!",
        AUCTION_VIDEO_NOT_FOUND: "Auction video not found!",
    },
    REFERRAL: {
        REFERRAL_FOUND: "Referral Code Found Successfully",
        REFERRAL_NOT_FOUND: "Referral code not found",
        REFERRAL_CONFIG_FOUND: "Referral Config Found Successfully",
        REFERRAL_CONFIG_NOT_FOUND: "Referral config not found",
        REFERRAL_CONFIG_UPDATED: "Referral Config Updated Successfully",
        REFERRAL_CONFIG_NOT_UPDATED: "Referral config not updated",
        REFERRAL_NOT_VALID: "Referral code is invalid",
    },
    CURRENCY: {
        CURRENCY_FOUND: "Currency Found",
        CURRENCY_NOT_FOUND: "Currency not found",
        CURRENCY_ALL: "All Currencies",
        CURRENCY_UPDATED: "Updated Currency Config",
        CURRENCY_NOT_UPDATED: "Currency config not updated",
        CURRENCY_UPDATE_FAILED: "You cannot update currency when an auction is LIVE or UPCOMING",
        CURRENCY_DEFAULT_VALUE: 0.2,
    },
    BIDBOT: {
        BIDBOT_CREATE_SUCCESS: "Bidbot created successfully",
        BIDBOT_FOUND: "Bidbot found successfully",
        BIDBOT_CREATE_FAIL: "Bidbot creation failed",
        BIDBOT_NOT_FOUND: "Bidbot not found or id is not valid",
        BIDBOT_UPDATE_LIMIT: "Bidbot limit updated successfully",
        BIDBOT_ACTIVE: "Bidbot active",
        BIDBOT_ACTIVATED: "Bidbot activated",
        BIDBOT_ALREADY_ACTIVE: "Bidbot already active",
        BIDBOT_NOT_ACTIVE: "Bidbot not active",
        BIDBOT_DEACTIVATED: "Bidbot deactivated",
        BIDBOT_DATA_EMPTY: "No existing bidbot data found for auction id ",
        BIDBOT_PLAYS_LIMIT: "Bidbot PLAYS limit reached",
        BITBOT_PLAYS_REQUIRED: "PLAYS limit is required",
        BIDBOT_PLAYS_NEGATIVE: "PLAYS limit should be valid i.e. more than 0",
        BIDBOT_PRICE_NEGATIVE: "Price limit can't be negative or less than 1",
        BIDBOT_PRICE_REACHED: "Auction price already crossed price limit",
        BIDBOT_PRICE_GREATER:"Bidbot price limit should be less than product price",
        BIDBOT_WALLET_INSUFFICIENT: "PLAYS balance insufficient",
        YOUR_BIDBOT_MADE_BID: "Your bidbot just made a bid!",
    },
    ALL: {
        MULTER_ERROR: "Multer error",
        COUNTRY: "Country Details ",
        IP_ADDR_NOT_FOUND: "Cannot fetch IP address",
        CURRENT_LOCATION: "Get Current Location",
        LOCATION_NOT_FOUND: "Cannot get the location",
    },
    JWT: {
        JWT_EXPIRED: "JWT expired",
        JWT_NOT_ACTIVE: "JWT not active",
        JWT_MALFORMED: "JWT malformed",
        TOKEN_NOT_FOUND: "Token not found",
        TOKEN_NOT_EXPIRED: "Token Not Expired",
        DATA_FOUND: "Data Found",
        UNAUTHORIZED: "Unauthorized",
    },
    TERM_CONDITION: {
        CREATED: "Terms And Conditions Added Successfully!",
        UPDATED: "Terms And Conditions Updated Successfully!",
        DELETED: "Terms And Conditions Deleted Successfully!",
        NOT_FOUND: "Terms And Conditions not Found!",
        FOUNDED: "Terms And Conditions Found Successfully!",
        INACTIVE_STATUS: "Status is not active",
        CONFLICT: "Terms and conditions already exists",
    },
    USER_PLAY_BALANCE: {
        PLAYER_BALANCE: "Player PLAYS Balances",
        PLAYER_NOT_FOUND: "Player not found!",
        PLAY_BALANCE_CREDITED: "Player Balance Credited!",
        PLAY_BALANCE_NOT_CREDITED: "Player balance not added, something went wrong!",
        USER_IS_NOT_PLAYER: "User is not a player!",
        USER_WALLET_BALANCE_NOT_FOUND: "PLAYS balance not found!",
    },
    PLAYER_WALLET_TRAX: {
        PLAYER_TRAX_NOT_FOUND: "Transaction not found in wallet!",
        INSUFFICIENT_PLAY_BALANCE: "Insufficient PLAYS balance!",
        PLAYS_NOT_DEBITED: "PLAYS not debited!",
        PLAYS_SUCCESSFULLY_DEBITED: "PLAYS Debited Successfully!",
        TRANSACTION_FAILED: "Transaction failed!",
        TRANSFER_SUCCESS: "Transfer Of PLAYS Is Succeessful",
        TRANSFER_FAIL: "Transfer of PLAYS failed",
    },
    PLAYER_AUCTION_REGISTEREATION: {
        PLAYER_REGISTERED: "You Are Registered In Auction!",
        PLAYER_NOT_REGISTERED: "You are not registered!",
        PLAYER_ALREADY_EXISTS: "Player already exists in auction!",
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
    MIN_MAX_BID_PERCENTAGE: "min:max:bid:percentage",
    AUCTION_MIN_MAX_PERCENTAGE: "auction:min:max:percentage",
    AUCTION_AVATARS: "auction:avatars",
    NEW_AUCTION_ADDED: "new:auction:added",
    PLAYER_BLOCK: "player:block",
    PLAYER_PLAYS_BALANCE:"player:plays:balance",
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
    PLAYER_PLAYS_BALANCE_TRANSFER: "player:balance:transfer",
    PLAYER_PLAYS_BALANCE_CREDITED: "auction:player:balance:credit",
    PLAYERS_PLAYS_BALANCE_REFUND: "auction:players:balance:refund",
    PLAYER_PLAYS_BALANCE_DEBIT: "auction:player:balance:debit",
    START_SIMULATION_LIVE_AUCTION: "start:simulation:auction",
    MULTIPLE_PLAYER_PLAY_BALANCE_CREDIED:
        "multiple:player:playbalance:credited",
    SIMULATION_BOTS: "simulation:bots",
    STOP_BOT_SIMULATIONS: "stop:bot:simulations",
    PLAYER_AUCTION_REGISTER_MAIL: "player:register:mail",
    REGISTER_NEW_PLAYER: "register:new:player",
    PLAYER_PLAYS_BALANCE:"player:plays:balance",
    AUCTION_WINNER:"auction:winners"
};

export const AUCTION_STATE = [
    "upcoming",
    "live",
    "completed",
    "cancelled",
] as const;

export const AUCTION_CATEGORY = [
    {
        title: "The Last Play",
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

export const userImages = [
    "assets/avatar/1.png",
    "assets/avatar/2.png",
    "assets/avatar/3.png",
    "assets/avatar/4.png",
    "assets/avatar/5.png",
    "assets/avatar/6.png",
    "assets/avatar/7.png",
    "assets/avatar/8.png",
    "assets/avatar/9.png",
    "assets/avatar/10.png",
    "assets/avatar/11.png",
    "assets/avatar/12.png",
    "assets/avatar/13.png",
    "assets/avatar/14.png",
    "assets/avatar/15.png",
    "assets/avatar/16.png",
] as const;

export const userImages1 = [
    "assets/avatar/17.png",
    "assets/avatar/18.png",
    "assets/avatar/19.png",
    "assets/avatar/20.png",
    "assets/avatar/21.png",
    "assets/avatar/22.png",
    "assets/avatar/23.png",
    "assets/avatar/24.png",
    "assets/avatar/25.png",
    "assets/avatar/26.png",
    "assets/avatar/27.png",
    "assets/avatar/28.png",
] as const;

export const ONE_PLAY_VALUE_IN_DOLLAR = 0.1;
