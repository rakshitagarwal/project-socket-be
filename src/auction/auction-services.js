import { createResponse, validateObjectId } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { validateStatus } from "../product/product-queries.js";
import {
  create,
  fetchAuction,
  auctionCategories,
  getAuctionById,
  putAuction,
  softDelete,
  filterAuction,
  validateAuctionStatus,
} from "./../auction/auction-queries.js";

export const addAuction = async (data) => {
  let { Product, AuctionCategory } = data;

  // check ObjectId
  const valid = validateObjectId(Product);
  if (!valid) {
    return createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.responseMessages.VALID_OBJECT_ID
    );
  }

  // check if a product is active or not
  const isActive = await validateStatus(Product);
  if (!isActive) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.responseMessages.PRODUCT_OBJECT_ID
    );
  }

  // check ObjectId
  const validAuctions = validateObjectId(AuctionCategory);
  if (!validAuctions) {
    return createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.responseMessages.VALID_OBJECT_ID
    );
  }

  // check if a auction category is active or not
  const isActiveAuction = await validateAuctionStatus(AuctionCategory);
  if (!isActiveAuction) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.responseMessages.PRODUCT_OBJECT_ID
    );
  }

  if (data.registerationStatus) {
    if (data.postAuctionStatus) {
      if (data.auctionPostRegister || data.auctionPreRegister) {
        return createResponse(
          helpers.StatusCodes.NOT_ACCEPTABLE,
          helpers.StatusMessages.NOT_ACCEPTABLE,
          {},
          {
            error: helpers.responseMessages.INVALID_RESPONSES,
          }
        );
      } else {
        const auction = await create(data);
        if (!auction) {
          return createResponse(
            helpers.StatusCodes.BAD_REQUEST,
            helpers.responseMessages.AUCTION_NOT_ADDED
          );
        }

        return createResponse(
          helpers.StatusCodes.OK,
          helpers.responseMessages.AUCTION_ADDED
        );
      }
    } else {
      if (data.auctionPostRegister) {
        return createResponse(
          helpers.StatusCodes.NOT_ACCEPTABLE,
          helpers.StatusMessages.NOT_ACCEPTABLE,
          {},
          {
            error: helpers.responseMessages.INVALID_RESPONSES,
          }
        );
      }

      const auction = await create(data);
      if (!auction) {
        return createResponse(
          helpers.StatusCodes.BAD_REQUEST,
          helpers.responseMessages.AUCTION_NOT_ADDED
        );
      }

      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.AUCTION_ADDED
      );
    }
  } else {
    if (!data.auctionPreRegister && !data.auctionPostRegister) {
      return createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        helpers.StatusMessages.NOT_ACCEPTABLE,
        {},
        {
          error: helpers.responseMessages.INVALID_RESPONSES,
        }
      );
    }

    const auction = await create(data);
    if (!auction) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.responseMessages.AUCTION_NOT_ADDED
      );
    } else {
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.AUCTION_ADDED
      );
    }
  }
};

export const getAuctions = async (query) => {
  let page = parseInt(query.page);
  let limit = parseInt(query.limit);

  const auctions = await fetchAuction(page, limit);
  let { auctionData, ...metadata } = auctions;

  if (auctionData.length > 0) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.StatusMessages.OK,
      auctionData,
      {
        ...metadata,
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
  let { Product, AuctionCategory } = updated;

  // check ObjectId
  const valid = validateObjectId(Product);
  if (!valid) {
    return createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.responseMessages.NOT_VALID_OBJECTID
    );
  }

  // check if a product is active or not
  const isActive = await validateStatus(Product);
  if (!isActive) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.responseMessages.PRODUCT_OBJECT_ID
    );
  }

  // check ObjectId
  const validAuctions = validateObjectId(AuctionCategory);
  if (!validAuctions) {
    return createResponse(
      helpers.StatusCodes.NOT_ACCEPTABLE,
      helpers.responseMessages.VALID_OBJECT_ID
    );
  }

  // check if a auction category is active or not
  const isActiveAuction = await validateAuctionStatus(AuctionCategory);
  if (!isActiveAuction) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.responseMessages.PRODUCT_OBJECT_ID
    );
  }

  const auction = await getAuctionById(id);

  if (!auction) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.StatusMessages.NOT_FOUND
    );
  }

  if (updated.registerationStatus) {
    if (updated.postAuctionStatus) {
      if (updated.auctionPostRegister || updated.auctionPreRegister) {
        return createResponse(
          helpers.StatusCodes.NOT_ACCEPTABLE,
          helpers.StatusMessages.NOT_ACCEPTABLE,
          {},
          {
            error: helpers.responseMessages.INVALID_RESPONSES,
          }
        );
      } else {
        const update = await putAuction(id, updated);

        if (!update) {
          return createResponse(
            helpers.StatusCodes.BAD_REQUEST,
            helpers.StatusMessages.BAD_REQUEST
          );
        }
        return createResponse(
          helpers.StatusCodes.OK,
          helpers.responseMessages.AUCTION_UPDATED
        );
      }
    } else {
      return createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        helpers.StatusMessages.NOT_ACCEPTABLE,
        {},
        {
          error: helpers.responseMessages.INVALID_RESPONSES,
        }
      );
    }
  } else {
    if (updated.postAuctionStatus) {
      if (updated.auctionPostRegister) {
        return createResponse(
          helpers.StatusCodes.NOT_ACCEPTABLE,
          helpers.StatusMessages.NOT_ACCEPTABLE,
          {},
          {
            error: helpers.responseMessages.INVALID_RESPONSES,
          }
        );
      }

      let { auctionPreRegister } = updated;

      const update = await putAuction(id, updated, auctionPreRegister);

      if (!update) {
        return createResponse(
          helpers.StatusCodes.BAD_REQUEST,
          helpers.StatusMessages.BAD_REQUEST
        );
      }
      return createResponse(
        helpers.StatusCodes.OK,
        helpers.responseMessages.AUCTION_UPDATED
      );
    }

    if (!updated.auctionPreRegister && !updated.auctionPostRegister) {
      return createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        helpers.StatusMessages.NOT_ACCEPTABLE,
        {},
        {
          error: helpers.responseMessages.INVALID_RESPONSES,
        }
      );
    }

    let { auctionPreRegister, auctionPostRegister } = updated;

    const update = await putAuction(
      id,
      updated,
      auctionPreRegister,
      auctionPostRegister
    );

    if (!update) {
      return createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.StatusMessages.BAD_REQUEST
      );
    }
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.AUCTION_UPDATED
    );
  }
};

export const deleteAuction = async (id) => {
  const auction = await getAuctionById(id);

  if (!auction) {
    return createResponse(
      helpers.StatusCodes.NOT_FOUND,
      helpers.StatusMessages.NOT_FOUND
    );
  }

  if (auction.state === "Publish") {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      "Aucion Cannot be deleted, because it has already started"
    );
  }

  const auctions = await softDelete(id);

  if (auctions) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.AUCTION_DELETED
    );
  }

  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.StatusMessages.BAD_REQUEST
  );
};

export const fetchAuctionById = async (id) => {
  const auction = await getAuctionById(id);
  const list = [];
  list.push(auction);
  if (auction) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.SINGLE_AUCTION,
      list
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
  let category = query.type;

  const searched = await filterAuction(page, limit, state, status, category);
  let { auctions, ...metadata } = searched;

  if (searched) {
    return createResponse(
      helpers.StatusCodes.OK,
      helpers.responseMessages.SEARCHED_AUCTION,
      auctions,
      {
        ...metadata,
      }
    );
  }
};
