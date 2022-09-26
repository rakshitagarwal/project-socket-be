import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { create, fetchAuction } from "./../auction/auction-queries.js";

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
