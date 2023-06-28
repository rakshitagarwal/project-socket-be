export const ENDPOINTS = {
    DOCS: "/docs",
    AUCTIONS: "/auction",
    BASE: "/",
    ROLE: "/role",
    USERS: "/user",
    LOGIN: "/login",
    REGISTER: "/register",
    ADMIN_LOGIN: "/admin/login",
    LOGOUT: "/logout",
    RESET_PASSWORD: "/reset-password",
    REFRESH_TOKEN: "/refresh-token",
    VERIFY: "/verify",
    ID: "/:id",
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html",
    LOGIN_OTP:"login_otp.html"
}

export const OTP_TYPE={
    EMAIL_VERIFICATION: "email_verification",
    LOGIN_TYPE: "login_type"

}

export const MESSAGES = {
    OTP:{
        INVALID_OTP: "Invalid otp"
    },
    USERS: {
       CHECK_MAIL:"Please check your email",
       USER_LOGIN:"user logged",
       USER_LOGOUT:"user logged out",
       USER_NOT_FOUND:"user not found",
       USER_EXIST:"user already exists",
       INVALID_CREDENTIAL:"Invalid credentials",
       ADMIN_EXIST:"admin already exists",
       USER_VERIFIED:"user verified",
       VERIFICATION_ERROR:"Please verify your email",
       USER_FOUND:"user found successfully",
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