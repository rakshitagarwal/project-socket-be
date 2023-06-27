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
    VERIFY: "/verify",
    ID: "/:id",
};

export const TEMPLATE = {
    EMAIL_VERIFICATION: "email_verification.html"
}

export const MESSAGES = {
    USERS: {
       CHECK_MAIL:"Please check your email",
       USER_LOGIN:"user logged",
       USER_LOGOUT:"user logged out",
       USER_EXIST:"user already exists",
       ADMIN_EXIST:"admin already exists"
    },
    ROLE:{
        ROLE_EXIST:"admin already exists",
        FOUND_ROLE:"role found successfully",
        ROLE_ADDED:"role added successfully"
    }
}