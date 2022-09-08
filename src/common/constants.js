// routing prefixs
export const USER_PREFIX = "/users";
export const PRODUCT_PREFIX = "/products";

// user paths
export const USER_REGISTER = USER_PREFIX + "/register";
export const FETCH_USER_EMAIL = USER_PREFIX + "/:email";
export const FETCH_USER_ID = USER_PREFIX + "/:id";

// product paths
export const FETCH_PRODUCT_DETAILS_ID = PRODUCT_PREFIX + "/:id";

export const USER_PATH = {
  USER_REGISTER,
  FETCH_USER_EMAIL,
};
