import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import {
  create,
  fetchAuction,
  auctionCategories,
  getAuctionById,
  putAuction,
} from "./../auction/auction-queries.js";

export const addAuction = async (data) => {
  const auction = await create(data);
  if (!auction) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      "Auction Can't Added"
    );
  }
  return createResponse(helpers.StatusCodes.OK, "Auction Added");
};

export const getAuctions = async () => {
  const auctions = await fetchAuction();

  if (auctions.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.StatusMessages.OK,
      auctions
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
