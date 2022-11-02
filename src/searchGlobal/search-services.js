import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { search } from "./search-queries.js";
export const searchModule = async (query) => {
  const pages = parseInt(query.page) || 0;
  const limit = parseInt(query.limit) || 4;
  const searchText = query.searchText || "";
  const moduleName = query.moduleName;

  if (moduleName === "User" || moduleName === "Product") {
    const searched = await search(pages, limit, searchText, moduleName);
    let { searchData, ...metadata } = searched;
    if (!searchData.length <= 0) {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.SEARCH_MODULE,
        searchData,
        { ...metadata }
      );
    }
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.DATA_NOT_FOUND,
      {},
      {}
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.responseMessages.MODULE_NOT_EXISTS,
    {},
    {}
  );
};
