import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import {
  create,
  fetchAuction,
  auctionCategories,
  getAuctionById,
  putAuction,
  softDelete,
  filterAuction,
} from "./../auction/auction-queries.js";

export const addAuction = async (data) => {
  if (!data.registerationStatus) {
    if (data.auctionPreRegister && data.auctionPostRegister) {
      return createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        helpers.StatusMessages.NOT_ACCEPTABLE,
        {},
        {
          error: "Invalid Response",
        }
      );
    }
    const auction = await create(data);
    if (!auction) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        "Auction Can't Added"
      );
    }

    return createResponse(helpers.StatusCodes.OK, "Auction Added");
  }

  if (data.registerationStatus) {
    if (!data.auctionPreRegister && !data.auctionPostRegister) {
      return createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        helpers.StatusMessages.NOT_ACCEPTABLE,
        {},
        {
          error: "Invalid Response",
        }
      );
    }

    const auction = await create(data);
    if (!auction) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        "Auction Can't Added"
      );
    }

    return createResponse(helpers.StatusCodes.OK, "Auction Added");
  }

  return createResponse(
    helpers.StatusCodes.NOT_ACCEPTABLE,
    helpers.StatusMessages.NOT_ACCEPTABLE,
    {},
    {
      error: "Invalid Response",
    }
  );
};

export const getAuctions = async (query) => {
  let page = parseInt(query.page) || 0;
  let limit = parseInt(query.limit) || 5;

  const auctions = await fetchAuction(page, limit);
  let {
    auctionData,
    page: pages,
    limit: limits,
    currentPage,
    recordCount,
  } = auctions;

  if (auctionData.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.StatusMessages.OK,
      auctionData,
      {
        pages,
        limits,
        currentPage,
        recordCount,
      }
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const getCategory = async () => {
  const category = await auctionCategories();

  if (category.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.StatusMessages.OK,
      category
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    helpers.StatusMessages.NOT_FOUND
  );
};

export const updateAuction = async (id, updated) => {
  const auction = await getAuctionById(id);

  if (!auction) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.StatusMessages.NOT_FOUND
    );
  }

  const { auctionPreRegister, auctionPostRegister, ...data } = auction;

  if (
    updated.auctionPreRegister &&
    updated.auctionPostRegister &&
    updated.registerationStatus
  ) {
    const { auctionPreRegister, auctionPostRegister, ...data } = updated;

    const updatedAuction = await putAuction(
      id,
      data,
      auctionPreRegister,
      auctionPostRegister
    );

    if (!updatedAuction) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.StatusMessages.BAD_REQUEST
      );
    }

    return createResponse(helpers.StatusCodes.OK, "Product Updated");
  }

  if (
    !updated.auctionPreRegister &&
    !updated.auctionPostRegister &&
    !updated.registerationStatus
  ) {
    const { auctionPreRegister, auctionPostRegister, ...data } = updated;

    const update = await putAuction(id, data);

    if (!update) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.StatusMessages.BAD_REQUEST
      );
    }

    return createResponse(
      helpers.StatusCodes.OK,
      helpers.StatusMessages.OK,
      update
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_ACCEPTABLE,
    helpers.StatusMessages.NOT_ACCEPTABLE,
    {},
    {
      error: "Invalid Response",
    }
  );
};

export const deleteAuction = async (id) => {
  const auctions = await softDelete(id);

  if (auctions) {
    return createResponse(helpers.StatusCodes.OK, "Auction Deleted");
  }

  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.StatusMessages.BAD_REQUEST
  );
};

export const fetchAuctionById = async (id) => {
  const auction = await getAuctionById(id);

  if (auction.length > 0 || auction) {
    return createResponse(
      helpers.StatusCodes.OK,
      "Get Single Auction",
      auction
    );
  }

  return createResponse(
    helpers.StatusCodes.NOT_FOUND,
    "Auction " + helpers.StatusMessages.NOT_FOUND
  );
};

export const searchByQuery = async (query) => {
  let page = parseInt(query.page) || 0;
  let limit = parseInt(query.limit) || 5;
  let state = query.state;
  let status = query.status;

  const searched = await filterAuction(page, limit, state, status);
  let { auctions, limits, pages, states, status: isActive, type } = searched;

  if (searched) {
    return createResponse(
      helpers.StatusCodes.OK,
      "Get all Searched",
      auctions,
      {
        limits,
        pages,
        states,
        isActive,
      }
    );
  }
};
