import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import {
  create,
  getProductById,
  update,
  removeProduct,
  getProducts,
  fetchAllCategory,
  search,
  getCategoryById,
} from "./product-queries.js";
import { validateObjectId } from "./../common/utilies.js";

export const createProduct = async (product) => {
  let { ProductCategory } = product;

  const validId = validateObjectId(ProductCategory);

  !validId &&
    createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.StatusMessages.NOT_ACCEPTABLE,
      {},
      {
        error: "check the ObjectID which is not valid",
      }
    );

  const isActive = await getCategoryById(ProductCategory);

  isActive &&
    createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.StatusMessages.NOT_ACCEPTABLE,
      {},
      {
        error: "check the ObjectID which is not valid",
      }
    );

  const productMeta = await create(product);

  if (productMeta !== undefined) {
    return createResponse(
      helpers.StatusCodes.CREATED,
      helpers.responseMessages.PRODUCT_ADDED
    );
  }

  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.StatusMessages.BAD_REQUEST
  );
};

export const deleteProduct = async (id) => {
  if (!validateObjectId(id)) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.BAD_REQUEST,
      {
        err: helpers.responseMessages.NOT_VALID_OBJECTID,
      }
    );
  }

  const productMeta = await getProductById(id);

  if (productMeta) {
    const metaData = await removeProduct(id);

    if (metaData) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.PRODUCT_DELETED
      );
    }

    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.BAD_REQUEST
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const updateProduct = async (id, product) => {
  if (!validateObjectId(id)) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.BAD_REQUEST,
      {
        err: helpers.responseMessages.NOT_VALID_OBJECTID,
      }
    );
  }

  const productMeta = await getProductById(id);

  if (productMeta) {
    const updateProduct = await update(id, product);
    if (updateProduct) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.PRODUCT_UPDATED
      );
    }
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.StatusMessages.BAD_REQUEST
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const fetchProduct = async (pages, limit) => {
  const productMeta = await getProducts(pages, limit);

  if (productMeta.products.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.PRODUCT_FETCHED,
      productMeta.products,
      {
        limit: productMeta.limit,
        currentPage: productMeta.currentPage,
        totalPages: productMeta.pages,
        recordCount: productMeta.recordCount,
      }
    );
  }
  const { limit: limits, currentPage, pages: page, recordCount } = productMeta;
  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND,
    {
      limits,
      currentPage,
      page,
      recordCount,
    }
  );
};

export const getProduct = async (id) => {
  if (!validateObjectId(id)) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.BAD_REQUEST,
      {
        err: helpers.responseMessages.NOT_VALID_OBJECTID,
      }
    );
  }

  const products = await getProductById(id);

  if (products) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.PRODUCT_SINGLE_FETCHED,
      products
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const getCategories = async () => {
  const category = await fetchAllCategory();

  if (category.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.PRODUCT_CATEGORY_FETCHED,
      category
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const findProduct = async (query) => {
  const { category, type, page, limit } = query;

  const searched = await search(
    parseInt(page),
    parseInt(limit),
    category,
    type
  );

  let {
    currentPage,
    limit: limits,
    pages,
    products,
    recordCount,
    searchText: text,
  } = searched;
  if (searched.products.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.PRODUCT_SEARCHED,
      products,
      {
        limits,
        pages,
        currentPage,
        recordCount,
        text,
      }
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND,
    {},
    {
      limits,
      currentPage,
      text,
      recordCount,
      pages,
    }
  );
};
