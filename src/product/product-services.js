import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { create } from "./product-queries.js";

export const createProduct = async (product) => {
  // TODO: `product` added should be passed to create()
  const productMeta = await create(product);

  if (product.length > 0 && typeof product !== undefined) {
    return createResponse(helpers.StatusCodes.CREATED, {
      message: `Product ${productMeta.name} Added`,
    });
  }
};
