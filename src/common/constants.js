// routing prefixs
export const USER_PREFIX = "/users";
export const PRODUCT_PREFIX = "/products";

// user paths
export const USER_LOGIN = USER_PREFIX + "/login";
export const USER_REGISTER = USER_PREFIX + "/register";
export const USER_UPDATE = USER_PREFIX + "/update/:id";
export const USER_DELETE = USER_PREFIX + "/delete/:id";
export const USER_DETAIL = USER_PREFIX + "/detail/:id";
export const FORGOT_PASSWORD = USER_PREFIX + "/forgot_password";
export const FETCH_USER_EMAIL = USER_PREFIX + "/:email";

// product paths
export const PRODUCT_ADD = PRODUCT_PREFIX + "/addproduct";
export const PRODUCT_DELETE = PRODUCT_PREFIX + "/removeproduct";
export const PRODUCT_UPDATE = PRODUCT_PREFIX + "/updateproduct";
export const PRODUCT_FETCH_ALL = PRODUCT_PREFIX + "/allproduct";
export const FETCH_PRODUCT_DETAILS_ID = PRODUCT_PREFIX + "/:id";

export const USER_PATH = {
  USER_LOGIN,
  USER_REGISTER,
  USER_UPDATE,
  USER_DELETE,
  USER_DETAIL,
  FORGOT_PASSWORD,
  FETCH_USER_EMAIL,
};
