export const ENDPOINTS = {
    BASE: "/",
    DOCS: "/docs",
    AUCTIONS: "/auction",
    PRODUCT_CATEGORY: "/product-category",

    AUCTION_CATEGORY: "/auction-category",
    ROLE: "/role",
    USERS: "/user",
    LOGIN: "/login",
    REGISTER: "/register",
    ADMIN_LOGIN: "/admin/login",
    LOGOUT: "/logout",
    RESET_PASSWORD: "/reset-password",
    FORGET_PASSWORD: "/forget-password",
    UPDATE_PASSWORD:"/update-password",
    REFRESH_TOKEN: "/refresh-token",
    VERIFY: "/verify",
    ID: "/:id",
    PRODUCT: "/product",

};
export const productCategoryMessage = {

    ADD: {
        SUCCESS: 'product category add success',
        ALREADY_EXIST: 'product category title already exist',
    },
    GET: {
        REQUESTED: 'get product category requested!',
        ALL: 'get all product category !',
        NOT_FOUND: 'product category id not found',
    },
    UPDATE: {
        SUCCESS: 'product category update success',
    },
}
export const AUCTION_CATEGORY_MESSAGES = {
    ADD: "auctionCategory created!",
    NOT_EXISTS: "auctionCategory id not found!",
    UPDATE: "auctionCategory updated!",
    NOT_FOUND: "auctionCategory not found!",
    GET_SINGLE: "auctionCategory found!",
    DELETE: "auctionCategory deleted!",
};
export const productMessage = {


    ADD: {
        SUCCESS: 'product add success',
        ALREADY_EXIST: 'product title already exist',
    },
    GET: {
        REQUESTED: 'get product requested!',
        ALL: 'get all product !',
        NOT_FOUND: 'product id not found',
    },
    UPDATE: {
        SUCCESS: 'product update success',
    },
}
export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP:"login_otp.html",
    FORGET_PASSWORD: "forget_password.html"
}

export const OTP_TYPE = {
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type",
    FORGET_PASSWORD: "forget_password"

}

export const MESSAGES = {
    OTP: {
        INVALID_OTP: "Invalid otp",

    },
    USERS: {
       CHECK_MAIL:"please check your email",
       USER_LOGIN:"user login successfully",
       USER_LOGOUT:"user logout successfully",
       USER_NOT_FOUND:"Account not found. Please sign-up to login.",
       USER_EXIST:"user already exists",
       INVALID_CREDENTIAL:"invalid credentials",
       ADMIN_EXIST:"admin already exists",
       USER_VERIFIED:"user verified",
       VERIFICATION_ERROR:"Please verify your email",
       USER_FOUND:"user found successfully",
       PASSWORD_UPDATED:"password updated",
       WORNG_PASSWORD:"Invalid old password",
       UPDATE_USER:"user update successfully",
       USER_DELETED:"user deleted",
       SIGNUP:"user register successfully!"
    },
    ROLE:{
        ROLE_EXIST:"admin already exists",
        FOUND_ROLE:"role found successfully",
        ROLE_ADDED:"role added successfully",
        ROlE_NOT_EXIST:"role not found"
    },
    JWT:{
        JWT_EXPIRED:"jwt expired",
        JWT_NOT_ACTIVE:"jwt not active",
        JWT_MALFORMED:"jwt malformed",
        TOKEN_NOT_FOUND:"token not found",
        TOKEN_NOT_EXPIRED:"token not expired",
        DATA_FOUND:"data found",
    }
}
