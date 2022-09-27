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

export const fetchAuction = async (page, limit) => {
  let auctionData = [];
  const count = await auctionModel.find({ status: false }).countDocuments();
  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  const auctions = await auctionModel
    .find({ status: false })
    .limit(limit)
    .skip(limit * page)
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  for (let i = 0; i < auctions.length; i++) {
    let id = auctions[i]._id;
    const auctionPreRegister = await auctionPreModel
      .findOne({ Auction: id })
      .select({
        startDate: 1,
        endDate: 1,
        participantCount: 1,
        participantFees: 1,
      })
      .lean();
    const auctionPostRegister = await auctionPostModel
      .findOne({ Auction: id })
      .select({ participantFees: 1 })
      .lean();
    auctionData.push({
      ...auctions[i],
      auctionPreRegister,
      auctionPostRegister,
    });
  }

  return {
    auctionData,
    page: totalPages,
    limit: limit,
    currentPage: page,
    recordCount: count,
  };
};

export const getAuctionById = async (id) => {
  const auction = await auctionModel
    .find({ _id: id, status: false })
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  const auctionPreRegister = await auctionPreModel
    .findOne({
      Auction: auction[0]._id,
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
      Auction: auction[0]._id,
    })
    .select({ participantFees: 1, _id: 0 });

  if (auctionPreRegister && auctionPostRegister) {
    return {
      ...auction,
      auctionPreRegister,
      auctionPostRegister,
    };
  }

  return auction;
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

export const softDelete = async (id) => {
  const auction = await auctionModel.findByIdAndUpdate(id, { status: true });
  await auctionPostModel.findOneAndUpdate({ Auction: id }, { status: true });
  await auctionPreModel.findOneAndUpdate({ Auction: id }, { status: true });

  return auction;
};

export const filterAuction = async (page, limit, state, status, type) => {
  const count = await auctionModel.find({ status: false }).countDocuments();
  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  const auctions = await auctionModel
    .find({ state: state, status: status })
    .limit(limit)
    .skip(limit * page)
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 }, { name: type })
    .lean();

  return {
    auctions,
    page: totalPages,
    limit: limit,
    currentPage: page,
    recordCount: count,
  };
};
