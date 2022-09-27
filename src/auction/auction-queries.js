import {
  auctionModel,
  auctionPreModel,
  auctionPostModel,
} from "./../auction/auction-schemas.js";

export const create = async (data) => {
  let { auctionPreRegister, auctionPostRegister, ...auction } = data;
  if (auctionPostRegister && auctionPreRegister && data.registerationStatus) {
    let auctionData = await auctionModel.create(auction);
    let auctionPreData = await auctionPreModel.create({
      ...auctionPreRegister,
      Auction: auctionData._id,
    });
    let auctionPostData = await auctionPostModel.create({
      ...auctionPostRegister,
      Auction: auctionData._id,
    });
    return auctionData;
  }
  const auctionData = await auctionModel.insertMany(auction);
  return auctionData;
};

export const fetchAuction = async () => {
  const auctions = await auctionModel
    .find({ status: "Active" })
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  return auctions;
};
