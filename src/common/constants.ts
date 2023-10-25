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
        ALREADY_EXIST: "Product Category Already Exist",
    },
    GET: {
        REQUESTED: "Product Category Found!",
        ALL: "All Product Categories!",
        NOT_FOUND: "Product Category Not Found",
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
    NOT_EXISTS: "Auction Category Id Not Found!",
    UPDATE: "Auction Category Updated!",
    NOT_FOUND: "Auction Category Not Found!",
    GET_SINGLE: "Auction Category Found!",
    DELETE: "Auction Category Deleted!",
};

export const AUCTION_MESSAGES = {
    CREATE: "Auction Created!",
    NOT_FOUND: "Auction Not Found!",
    NOT_CREATED: "Auction Not Created!, Something Went Wrong",
    FOUND: "Auction Found!",
    UPDATE: "Auction Updated!",
    REMOVE: "Auction Deleted!",
    NOT_ACTIVE: "Auction Not Active",
    CANCELLED: "Auction Cancelled Successfully!",
    CANT_CANCEL: "Auction Can't Be Cancelled",
    PRE_REGISTER_ERROR: "This Is An Open Auction, Registeration Not Applicable!",
    PLAYER_COUNT_NOT_REACHED: "Player Registeration Count Not Reached",
    AUCTION_ALREADY_STARTED: "Auction Is Live, You Can't Update This Auction Detials!",
    AUCTION_LIVE_DELETE: "Auction Is Live, You Can't Delete!",
    AUCTION_LIVE_UPDATE: "Auction Is Live, You Can't Update!",
    AUCTION_COMPLETED_DELETE: "Auction Is Completed, You Can't Delete!",
    AUCTION_COMPLETED_UPDATE: "Auction Is Completed, You Can't Update!",
    SOMETHING_WENT_WRONG: "Can't Start This Auction, Something Went Wrong!",
    CANNOT_DELETE_AUCTION: "Something Went Wrong",
    DATE_NOT_PROPER: "Start Date Should Be Greater Or Equal To Current Date!",
    AUCTION_ALREADY_SET: "Can't Update As Start Date Already Added!",
    BOT_SIMULATION_NOT_LIVE: "Auction Is Not Live, Simulation Can't Start",
    SIMULATION_STARTED: "Simulation Started",
    SIMULATION_STOPPED: "Simulation Stopped",
    GET_BID_LOGS: "All BigLogs",
    BID_LOGS_NOT_FOUND: "BidLogs Not Found",
    ALREADY_EXIST: "Auction category already exist",
};

export const productMessage = {
    ADD: {
        SUCCESS: "Product Added Successfully",
        ALREADY_EXIST: "Product Title Already Exist",
        PRODUCT_ADDED_WITH_AUCTION:
            "Cannot Delete Product As Its Binded With Some Auction",
    },
    GET: {
        REQUESTED: "Product Requested!",
        ALL: "All Products!",
        NOT_FOUND: "Product Id Not Found!",
        SOME_NOT_FOUND: "Some Product, Product Media Or Media Not Found!",
        PRODUCT_MEDIA_NOT_FOUND: "Product Media Not Found!",
        PRODUCT_MEDIA_IDS: "Product Media Ids Don't Exist!",
    },
    UPDATE: {
        SUCCESS: "Product Update Successfully",
        IN_AUCTIONS: "Update Failed. Product Already Exists In Some Auction",
        TRANSACTION_FAIL:
            " Prisma Has Failed Due To Some Conflict Between Two Or More Transactions",
    },
    DELETE: {
        SUCCESS: "Product Deleted Successfully",
        FAIL: "Product Delete Failed",
    },
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP: "login_otp.html",
    FORGET_PASSWORD: "forget_password.html",
    PLAYER_REGISTERATION: "auction_player_registeration.html",
    PLAYER_AUCTION_REGISTER: "player_auction_register.html",
    REGISTER_PRE_ADMIN: "registration_per_admin.html",
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
        NOT_CREATED: "Transaction Not Created!",
        CREATED_SUCCESS: "Transaction Created Successfully!",
        GET_NOW_EXPIRED: "Product Purchase Time Expired!",
        AUCTION_NOT_COMPELETED: "Auction Is Not Completed!",
        ALREADY_PURCHASE_PRODUCT: "You Have Already Purchased The Product",
    },
    SOCKET: {
        TOTAL_AUCTION_REGISTERED: "Total Players Registered On Auction",
        AUCTION_LIVE: "Auction Live",
        AUCTION_BUY_NOW: "Auction Buy Now",
        AUCTION_WINNER: "Auction Winner",
        AUCTION_CLOSED: "Auction Ended",
        AUCTION_COUNT_DOWN: "Auction Timer Countdown",
        AUCTION_RECENT_BID: "Auction Recent Bid",
        RECENT_BIDS: "Recents Bids History",
        ACTIVE_PLAYERS: "Active Players' Avatars",
        AUCTION_ENDED: "Auction Ended",
        CURRENT_PLAYS: "Current PLAYS",
        AUCTION_NOT_FOUND: "Auction Not Found",
        USER_NOT_REGISTERED: "You Are Not Registered In This Auction",
        CONTINUE_BID_NOT_ALLOWED: "Continued Bid Not Allowed",
        INSUFFICIENT_PLAYS_BALANCED: "Insufficient PLAYS Balance",
        BUY_NOW: "Buy Now",
        AUCTION_NOT_LIVE: "Auction Not Live",
    },
    OTP: {
        INVALID_OTP: "Invalid OTP",
    },
    USERS: {
        CHECK_MAIL: "Please Check Your Email",
        USER_LOGIN: "Login Successful!",
        USER_LOGOUT: "Logged Out Successfully",
        USER_NOT_FOUND: "Account Not Found. Please Sign-up To Login.",
        USER_EXIST: "This Email Address Already Exists. Please Login",
        INVALID_CREDENTIAL: "Invalid Credentials",
        ADMIN_EXIST: "Admin Already Exists",
        USER_VERIFIED: "User Verified",
        VERIFICATION_ERROR: "Please Verify Your Email",
        USER_FOUND: "User Found Successfully",
        INVALID_PLAYS: "PLAYS Cannot Be In Decimal",
        EMAIL_BLOCKED_INVALID: "Cannot Transfer PLAYS As Player Doesn't Exist Or Is Blocked",
        INVALID_TRANSFER: "You Are Not Allowed To Transfer PLAYS to Your Own Account",
        INSUFFICIENT_BALANCE: "Your PLAYS Balance Is Insufficient For Transfer",
        ID_NOT_FOUND: "User Id Not Found",
        PASSWORD_UPDATED: "Password Updated",
        WRONG_PASSWORD: "Invalid Old Password",
        UPDATE_USER: "Profile Details Updated Successfully",
        USER_DELETED: "User Deleted",
        SIGNUP: "Registered Successfully!",
        PLAYER_NOT_REGISTERED: "You Are Not Registered",
        CHECK_YOUR_EMAIL_VERIFY_ACCOUNT:
            "Please Check Your Email And Verify Your Account!",
        PLEASE_VERIFY_YOUR_EMAIL: "Please Verify Your Account!",
        USER_TEMPORARY_BLOCK:
            "Your Account Is Temporarily Blocked. Please Contact Customer Service.",
        AVATAR: "User Avatar's",
    },
    ROLE: {
        ROLE_EXIST: "Admin Already Exists",
        FOUND_ROLE: "Role Found Successfully",
        ROLE_ADDED: "Role Added Successfully",
        ROlE_NOT_EXIST: "Role Not Found",
    },
    MEDIA: {
        REQUEST_MEDIA: "Requested Media",
        MEDIA_NOT_ATTACHED: "Media File Not Attached Or Not Acceptable",
        MEDIA_ID: "Media Id Not Provided",
        MEDIA_CREATE_FAIL: "Media Creation Failed",
        MEDIA_DELETE_SUCCESS: "Media Deleted Successfully",
        MEDIA_DELETE_FAIL: "Media Delete Failed",
        MEDIA_CREATE_SUCCESS: "Media Created Successfully",
        MEDIA_STATUS_CHANGE_SUCCESS: "Media Status Changed Successfully",
        MEDIA_SINGLE_INVALID: "Please Select Only One Media File",
        MEDIA_FILES_INVALID: "Media Files Invalid",
        MEDIA_NOT_ALLOWED: "Please Select Minimum 5 Supported Media Files",
        MEDIA_MIN_ID: "Atleast One Media Id Should Be Provided",
        MEDIA_NOT_FOUND: "Media Id Not Found Or Invalid",
        MEDIA_IDS_NOT_FOUND: "Some Media Ids Are Not Found",
        AUCTION_IMAGE_NOT_FOUND: "Auction Image Not Found!",
        AUCTION_VIDEO_NOT_FOUND: "Auction Video Not Found!",
    },
    REFERRAL: {
        REFERRAL_FOUND: "Referral Code Found Successfully",
        REFERRAL_NOT_FOUND: "Referral Code Not Found",
        REFERRAL_CONFIG_FOUND: "Referral Config Found Successfully",
        REFERRAL_CONFIG_NOT_FOUND: "Referral Config Not Found",
        REFERRAL_CONFIG_UPDATED: "Referral Config Updated Successfully",
        REFERRAL_CONFIG_NOT_UPDATED: "Referral Config Not updated",
        REFERRAL_NOT_VALID: "Referral Code Is Invalid",
    },
    CURRENCY: {
        CURRENCY_FOUND: "Currency Found",
        CURRENCY_NOT_FOUND: "Currency Not Found",
        CURRENCY_ALL: "All Currencies",
        CURRENCY_UPDATED: "Updated Currency Config",
        CURRENCY_NOT_UPDATED: "Currency Config Not Updated",
        CURRENCY_UPDATE_FAILED:
            "You Cannot Update Currency When An Auction Is LIVE Or UPCOMING",
        CURRENCY_DEFAULT_VALUE: 0.20,
    },
    BIDBOT: {
        BIDBOT_CREATE_SUCCESS: "Bidbot Created Successfully",
        BIDBOT_FOUND: "Bidbot Found Successfully",
        BIDBOT_CREATE_FAIL: "Bidbot Creation Failed",
        BIDBOT_NOT_FOUND: "Bidbot Not Found Or Id Is Not Valid",
        BIDBOT_UPDATE_LIMIT: "Bidbot Limit Updated Successfully",
        BIDBOT_ACTIVE: "Bidbot Active",
        BIDBOT_ACTIVATED: "Bidbot Activated",
        BIDBOT_ALREADY_ACTIVE: "Bidbot Already Active",
        BIDBOT_NOT_ACTIVE: "Bidbot Not Active",
        BIDBOT_DEACTIVATED: "Bidbot Deactivated",
        BIDBOT_DATA_EMPTY: "No Existing Bidbot Data Found For Auction Id ",
        BIDBOT_PLAYS_LIMIT: "Bidbot PLAYS Limit Reached",
        BITBOT_PLAYS_REQUIRED: "PLAYS Limit Is Required",
        BIDBOT_PLAYS_NEGATIVE: "PLAYS Limit Should Be Valid i.e. More Than 0",
        BIDBOT_PRICE_NEGATIVE: "Price Limit Can't Be Negative Or Less Than 1",
        BIDBOT_PRICE_REACHED: "Auction Price Already Crossed Price Limit",
        BIDBOT_PRICE_GREATER: "Bidbot Price Limit Should Be Less Than Product Price",
        BIDBOT_WALLET_INSUFFICIENT: "PLAYS Balance Insufficient",
        YOUR_BIDBOT_MADE_BID:"Your Bidbot Just Made A Bid!",
    },
    ALL: {
        MULTER_ERROR: "Multer Error",
        COUNTRY: "Country Details ",
        IP_ADDR_NOT_FOUND: "Cannot fetch IP address",
        CURRENT_LOCATION: "Get Current Location",
        LOCATION_NOT_FOUND: "Cannot Get The Location",
    },
    JWT: {
        JWT_EXPIRED: "JWT Expired",
        JWT_NOT_ACTIVE: "JWT Not Active",
        JWT_MALFORMED: "JWT Malformed",
        TOKEN_NOT_FOUND: "Token Not Found",
        TOKEN_NOT_EXPIRED: "Token Not Expired",
        DATA_FOUND: "Data Found",
        UNAUTHORIZED: "Unauthorized",
    },
    TERM_CONDITION: {
        CREATED: "Terms And Conditions Added Successfully!",
        UPDATED: "Terms And Conditions Updated Successfully!",
        DELETED: "Terms And Conditions Deleted Successfully!",
        NOT_FOUND: "Terms And Conditions Not Found!",
        FOUNDED: "Terms And Conditions Found Successfully!",
        INACTIVE_STATUS: "Status Is Not Active",
        CONFLICT: "Terms And Conditions already exists",
    },
    USER_PLAY_BALANCE: {
        PLAYER_BALANCE: "Player PLAYS Balances",
        PLAYER_NOT_FOUND: "Player Not Found!",
        PLAY_BALANCE_CREDITED: "Player Balance Credited!",
        PLAY_BALANCE_NOT_CREDITED: "Player Balance Not Added, Something Went Wrong!",
        USER_IS_NOT_PLAYER: "User Is Not A Player!",
        USER_WALLET_BALANCE_NOT_FOUND: "PLAYS Balance Not Found!",
    },
    PLAYER_WALLET_TRAX: {
        PLAYER_TRAX_NOT_FOUND: "Transaction Not Found In Wallet!",
        INSUFFICIENT_PLAY_BALANCE: "Insufficient PLAYS Balance!",
        PLAYS_NOT_DEBITED: "PLAYS Not Debited!",
        PLAYS_SUCCESSFULLY_DEBITED: "PLAYS Debited Successfully!",
        TRANSACTION_FAILED: "Transaction Failed!",
        TRANSFER_SUCCESS: "Transfer Of PLAYS Is Succeessful",
        TRANSFER_FAIL: "Transfer Of PLAYS Failed",
    },
    PLAYER_AUCTION_REGISTEREATION: {
        PLAYER_REGISTERED: "You Are Registered In Auction!",
        PLAYER_NOT_REGISTERED: "You Are Not Registered!",
        PLAYER_ALREADY_EXISTS: "Player Already Exists In Auction!",
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
    MULTIPLE_PLAYER_PLAY_BALANCE_CREDIED: "multiple:player:playbalance:credited",
    SIMULATION_BOTS: "simulation:bots",
    STOP_BOT_SIMULATIONS: "stop:bot:simulations",
    PLAYER_AUCTION_REGISTER_MAIL: "player:register:mail",
    REGISTER_NEW_PLAYER: "register:new:player",
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
    "assets/avatar/16.png"
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
    "assets/avatar/28.png"
] as const;

export const ONE_PLAY_VALUE_IN_DOLLAR = 0.1;
