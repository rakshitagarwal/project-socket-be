import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import {
  create,
  getProductById,
  update,
  removeProduct,
} from "./product-queries.js";

export const createProduct = async (product) => {
  const productMeta = await create(product);

  if (productMeta !== undefined) {
    return createResponse(helpers.StatusCodes.CREATED, {
      message: `Product ${productMeta.title} Added`,
    });
  }

  return createResponse(helpers.StatusCodes.BAD_REQUEST, {
    message: helpers.StatusMessages.BAD_REQUEST,
  });
};

export const deleteProduct = async (id) => {
  const productMeta = await getProductById(id);

  if (productMeta) {
    const metaData = await removeProduct(id);

    if (metaData) {
      return createResponse(helpers.StatusCodes.OK, {
        message: `Product Deleted ${metaData.title}`,
      });
    }
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};

export const updateProduct = async (id, product) => {
  // TODO: it will get specific product on basis of ID
  const productMeta = await getProductById(id);

  if (productMeta.length > 0 && typeof productMeta !== undefined) {
    const updateProduct = await update(id, product);
    if (updateProduct > 0 && typeof updateProduct !== undefined) {
      return createResponse(helpers.StatusCodes.OK, {
        message: `Product ${productMeta.name} updated`,
      });
    }
  }

  return createResponse(helpers.StatusCodes.BAD_REQUEST, {
    message: helpers.StatusMessages.BAD_REQUEST,
  });
};
