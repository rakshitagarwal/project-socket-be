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
} from "./product-queries.js";
import { validateObjectId } from "./../common/utilies.js";

export const createProduct = async (product) => {
  const productMeta = await create(product);

  if (productMeta !== undefined) {
    return createResponse(helpers.StatusCodes.CREATED, "Product Added");
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
      helpers.StatusMessages.BAD_REQUEST,
      {
        err: `Not Valid ObjectId you have sent ${id}`,
      }
    );
  }

  const productMeta = await getProductById(id);

  if (productMeta) {
    const metaData = await removeProduct(id);

    if (metaData) {
      return createResponse(helpers.StatusCodes.OK, `Product Deleted`);
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

export const updateProduct = async (id, product) => {
  if (!validateObjectId(id)) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.StatusMessages.BAD_REQUEST,
      {
        err: `Not Valid ObjectId you have sent ${id}`,
      }
    );
  }

  const productMeta = await getProductById(id);

  if (productMeta) {
    const updateProduct = await update(id, product);
    if (updateProduct) {
      return createResponse(helpers.StatusCodes.OK, `Product Updated`);
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
      "All Products Fetched",
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
      helpers.StatusMessages.BAD_REQUEST,
      {
        err: `Not Valid ObjectId you have sent ${id}`,
      }
    );
  }

  const products = await getProductById(id);

  if (products) {
    return createResponse(
      helpers.StatusCodes.OK,
      "fetched single product",
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
      "Fetch All Categories with types",
      category
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const findProduct = async (query) => {
  const page = parseInt(query.page) || 0;
  const limit = parseInt(query.limit) || 5;
  const searchText = query.searchText || "";

  const searched = await search(page, limit, searchText);

  if (searched.products.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      "Searched Appeared",
      searched.products,
      {
        limit: searched.limit,
        currentPage: searched.currentPage,
        searchText: searched.searchText || "",
        recordCount: searched.recordCount,
        pages: searched.totalPage,
      }
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND,
    {},
    {
      limit: searched.limit,
      currentPage: searched.currentPage,
      searchText: searched.searchText || "",
      recordCount: searched.recordCount,
      pages: searched.totalPage,
    }
  );
};
