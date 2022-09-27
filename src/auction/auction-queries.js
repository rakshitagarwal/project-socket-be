import {
  auctionModel,
  auctionPreModel,
  auctionPostModel,
  auctionCategory,
} from "./../auction/auction-schemas.js";

export const auctionCategories = async () => {
  const categories = await auctionCategory
    .find()
    .select({ _id: 1, name: 1 })
    .lean();
  return categories;
};

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
  let auctionData = [];
  const auctions = await auctionModel
    .find({ status: "Active" })
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  for (let i = 0; i < auctions.length; i++) {
    let id = auctions[i]._id;
    const preData = await auctionPreModel.find({ Auction: id });
    const postData = await auctionPostModel.find({ Auction: id });
    auctionData.push({
      ...auctions[i],
      preData,
      postData,
    });
  }

  return auctionData;
};

export const getAuctionById = async (id) => {
  const auction = await auctionModel
    .findById(id)
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  const auctionPreRegister = await auctionPreModel
    .findOne({
      Auction: auction._id,
    })
    .select({
      startDate: 1,
      endDate: 1,
      participantCount: 1,
      participantFees: 1,
      _id: 1,
    })
    .lean();

  const auctionPostRegister = await auctionPostModel
    .findOne({
      Auction: auction._id,
    })
    .select({ participantFees: 1, _id: 0 });

  return {
    ...auction,
    auctionPreRegister,
    auctionPostRegister,
  };
};

export const putAuction = async (id, auction, pre, post) => {
  if (!pre && !post) {
    const auction = await auctionModel.findByIdAndUpdate(id, auction);
    return auction;
  }

  const updatedAuction = await auctionModel.findByIdAndUpdate(id, auction);
  const preAuction = await auctionPreModel.findOneAndUpdate(
    { Auction: id },
    pre
  );
  const postAuction = await auctionPostModel.findOneAndUpdate(
    { Auction: id },
    post
  );

  return {
    ...updatedAuction,
    preAuction,
    postAuction,
  };
};
