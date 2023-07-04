export const ENDPOINTS = {
    BASE: "/",
    DOCS: "/docs",
    AUCTIONS: "/auction",
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
    TERM_CONDITION: "/term-condition",
    MEDIA: "/media",
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
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP: "login_otp.html",
    FORGET_PASSWORD: "forget_password.html",
};

export const OTP_TYPE = {
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type",
    FORGET_PASSWORD: "forget_password",
};

export const MESSAGES = {
    OTP: {
        INVALID_OTP: "Invalid otp",
    },
    USERS: {
        CHECK_MAIL: "please check your email",
        USER_LOGIN: "user login successfully",
        USER_LOGOUT: "user logout successfully",
        USER_NOT_FOUND: "Account not found. Please sign-up to login.",
        USER_EXIST: "user already exists",
        INVALID_CREDENTIAL: "invalid credentials",
        ADMIN_EXIST: "admin already exists",
        USER_VERIFIED: "user verified",
        VERIFICATION_ERROR: "Please verify your email",
        USER_FOUND: "user found successfully",
        PASSWORD_UPDATED: "password updated",
        WORNG_PASSWORD: "Invalid old password",
        UPDATE_USER: "user update successfully",
        USER_DELETED: "user deleted",
        SIGNUP: "user register successfully!",
    },
    ROLE: {
        ROLE_EXIST: "admin already exists",
        FOUND_ROLE: "role found successfully",
        ROLE_ADDED: "role added successfully",
        ROlE_NOT_EXIST: "role not found",
    },
    MEDIA: {
        REQUEST_MEDIA: "requested media",
        MEDIA_NOT_ATTACHED: "media not attached",
        MEDIA_ID: "media id not provided",
        MEDIA_UPDATE_SUCCESS: "media updated successfully",
        MEDIA_DELETE_SUCCESS: "media deleted successfully",
        MEDIA_DELETE_FAIL: "media delete failed",
        MEDIA_CREATE_SUCCESS: "media created successfully",
        MEDIA_STATUS_CHANGE_SUCCESS: "media status changed successfully",
        MEDIA_SINGLE_INVALID: "media file more than 1",
        MEDIA_FILES_INVALID: "media files invalid",
        MEDIA_NOT_ALLOWED:
            "images less than 5 or contain media which are not allowed",
        MEDIA_MIN_ID: "atleast one media id should be provided",
        MEDIA_NOT_FOUND: "media id not found or not valid",
        MEDIA_IDS_NOT_FOUND: "some media ids were not found",
    },
    ALL: {
        MULTER_ERROR: "multer error",
    },
    JWT: {
        JWT_EXPIRED: "jwt expired",
        JWT_NOT_ACTIVE: "jwt not active",
        JWT_MALFORMED: "jwt malformed",
        TOKEN_NOT_FOUND: "token not found",
        TOKEN_NOT_EXPIRED: "token not expired",
        DATA_FOUND: "data found",
    },
    TERM_CONDITION: {
        CREATED: "term and condition added successfully!",
        UPDATED: "term and condition updated successfully!",
        DELETED: "term and condition deleted successfully!",
        NOT_FOUND: "term and condition not found!",
        FOUNDED: "term and condition found successfully!",
        INACTIVE_STATUS: "status is not active",
    },
};
