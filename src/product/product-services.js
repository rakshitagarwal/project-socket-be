import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import {
  create,
  getProductById,
  update,
  removeProduct,
  getProducts,
} from "./product-queries.js";

export const createProduct = async (product) => {
  const productMeta = await create(product);
    
  if (productMeta !== undefined) {
    return createResponse(helpers.StatusCodes.CREATED, {
      message: `Product Added`,
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
        message: `Product Deleted`,
      });
    }

    return createResponse(helpers.StatusCodes.BAD_REQUEST, {
      message: helpers.StatusMessages.BAD_REQUEST,
    });
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};

export const updateProduct = async (id, product) => {
  const productMeta = await getProductById(id);

  if (productMeta) {
    const updateProduct = await update(id, product);
    if (updateProduct) {
      return createResponse(helpers.StatusCodes.OK, {
        message: `Product Updated`,
      });
    }
    return createResponse(helpers.StatusCodes.BAD_REQUEST, {
      message: helpers.StatusMessages.BAD_REQUEST,
    });
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};

export const fetchProduct = async (pages, limit) => {
  const productMeta = await getProducts(pages, limit);

  if (productMeta) {
    return createResponse(helpers.StatusCodes.OK, productMeta.products, {
      limit: productMeta.limit,
      currentPage: productMeta.currentPage,
      totalPages: productMeta.pages,
    });
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};

export const getProduct = async (id) => {
  const products = await getProductById(id);

  if (products) {
    return createResponse(helpers.StatusCodes.OK, products);
  }

  return createResponse(helpers.StatusCodes.NOT_FOUND, {
    message: helpers.StatusMessages.NOT_FOUND,
  });
};
