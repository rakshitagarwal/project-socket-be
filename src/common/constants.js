// routing prefixs
export const USER_PATHNAME = "/users";
export const PRODUCT_PATHNAME = "/products";
export const AUCTION_PATHNAME = "/auctions";
export const SETTING_PATHNAME = "/settings";
export const SEARCH_PATHNAME = "/search";
export const UPLOAD_PATHNAME = "/uploads";
export const ROLE_PATHNAME = "/roles";
export const ID_POSTFIX = "/:id";
export const PREFIX_VERSION = "/v1";
export const USER_PATH = "/";
export const USER_PATH_ALLID = "/*/";
// user paths
export const USER_LOGIN = "/login";
export const USER_LOGOUT = "/logout";
export const USER_SETPASSWORD = "/set-password/:passcode";
export const USER_FORGET = "/forget-password";
export const USER_RESET = "/password-reset/:passcode";
export const USER_REGISTER = "/";
export const USER_PERMISSION = "/permission";
const FETCH_USER_EMAIL = USER_PATHNAME + "/:email";
const FETCH_USER_ID = USER_PATHNAME + ID_POSTFIX;
const CHANGE_USER_STATUS = USER_PATHNAME + "/status";

// product paths
const FETCH_PRODUCT_DETAILS_ID = PRODUCT_PATHNAME + ID_POSTFIX;
const CHANGE_PRODUCT_STATUS = PRODUCT_PATHNAME + "/status";

// auction paths
const FETCH_AUCTION_DETAILS_ID = AUCTION_PATHNAME + ID_POSTFIX;
const CHANGE_AUCTION_STATUS = AUCTION_PATHNAME + "/status";

// role paths
const FETCH_ROLE_DETAILS_ID = ROLE_PATHNAME + ID_POSTFIX;
const CHANGE_ROLE_STATUS = ROLE_PATHNAME + "/status";
