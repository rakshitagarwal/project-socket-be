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
    VERIFY: "/verify",
    ID: "/:id",
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
export const AUCTION_CATEGORY_MESSAGES = {
    ADD: "auctionCategory created!",
    NOT_EXISTS: "auctionCategory id not found!",
    UPDATE: "auctionCategory updated!",
    NOT_FOUND: "auctionCategory not found!",
    GET_SINGLE: "auctionCategory found!",
    DELETE: "auctionCategory deleted!",
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP: "login_otp.html",
};

export const OTP_TYPE = {
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type",
};

export const MESSAGES = {
    OTP: {
        INVALID_OTP: "Invalid otp",
    },
    USERS: {
        CHECK_MAIL: "Please check your email",
        USER_LOGIN: "user logged",
        USER_LOGOUT: "user logged out",
        USER_NOT_FOUND: "user not found",
        USER_EXIST: "user already exists",
        INVALID_CREDENTIAL: "Invalid credentials",
        ADMIN_EXIST: "admin already exists",
        USER_VERIFIED: "user verified",
        VERIFICATION_ERROR: "Please verify your email",
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
        MEDIA_DELETE_FAIL : "media delete failed",
        MEDIA_CREATE_SUCCESS: "media created successfully",
        MEDIA_STATUS_CHANGE_SUCCESS: "media status changed successfully",
        MEDIA_SINGLE_INVALID: "media file more than 1",
        MEDIA_FILES_INVALID: "media files invalid",
        MEDIA_NOT_ALLOWED: "images less than 5 or contain media which are not allowed"
    },
    ALL: {
        MULTER_ERROR: "multer error"
    }
}
