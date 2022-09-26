import { auctionModel } from "./../auction/auction-schemas.js";

export const create = async (data) => {
  const auction = await auctionModel.insertMany(data);
  return auction;
};

export const fetchAuction = async () => {
  const auctions = await auctionModel.find({ status: "Active", createdAt: -1 });
  return auctions;
};
