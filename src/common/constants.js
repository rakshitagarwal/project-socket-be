// routing prefixs
export const USER_PATHNAME = "/users";
export const PRODUCT_PATHNAME = "/products";
export const AUCTION_PATHNAME = "/auctions";
export const ROLE_PATHNAME = "/roles";
export const ID_POSTFIX = ":id";
export const PREFIX_VERSION = "v1";

// user paths
export const USER_LOGIN = USER_PATHNAME + "/login";
const USER_REGISTER = USER_PATHNAME + "/register";
const FETCH_USER_EMAIL = USER_PATHNAME + "/:email";
const FETCH_USER_ID = USER_PATHNAME + ID_POSTFIX;
const CHANGE_USER_STATUS = USER_PATHNAME + "/status";

// product paths
const FETCH_PRODUCT_DETAILS_ID = PRODUCT_PATHNAME + ID_POSTFIX;
const CHANGE_PRODUCT_STATUS = PRODUCT_PATHNAME + "/status";

// auction paths
const FETCH_AUCTION_DETAILS_ID = AUCTION_PREFIX + ID_POSTFIX;
const CHANGE_AUCTION_STATUS = AUCTION_PREFIX + "/status";

// role paths
const FETCH_ROLE_DETAILS_ID = ROLE_PREFIX + ID_POSTFIX;
const CHANGE_ROLE_STATUS = ROLE_PREFIX + "/status";
