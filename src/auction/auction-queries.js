import {
  auctionModel,
  auctionPreModel,
  auctionPostModel,
  auctionCategory,
} from "./../auction/auction-schemas.js";

export const auctionCategories = async () => {
  const categories = await auctionCategory
    .find({ status: false })
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
  const count = await auctionModel.find({ IsDeleted: false }).countDocuments();
  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  const auctions = await auctionModel
    .find({ IsDeleted: false })
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
    .findById(id)
    .find({ IsDeleted: false })
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

  if (auctionPreRegister && auctionPostRegister) {
    const auctions = {
      ...auction,
      auctionPreRegister,
      auctionPostRegister,
    };
    return auctions;
  }

  return auction;
};

export const putAuction = async (id, data, pre, post) => {
  if (!pre && !post) {
    const auction = await auctionModel.findByIdAndUpdate(id, data);
    return auction;
  }

  const updatedAuction = await auctionModel.findByIdAndUpdate(id, {
    ...data,
    auctionPreRegister: pre,
    auctionPostRegister: post,
  });
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
  const auction = await auctionModel.findByIdAndUpdate(id, { IsDeleted: true });
  await auctionPostModel.findOneAndUpdate({ Auction: id }, { status: true });
  await auctionPreModel.findOneAndUpdate({ Auction: id }, { status: true });

  return auction;
};

export const filterAuction = async (page, limit, state, status, category) => {
  const count = await auctionModel
    .find({ state: state, status: status, IsDeleted: false })
    .limit(limit)
    .skip(limit * page)
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 }, { name: category })
    .countDocuments();

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
    .populate("AuctionCategory", { _id: 1, name: 1 }, { name: category })
    .lean();

  return {
    auctions,
    page: totalPages,
    limit: limit,
    currentPage: page,
    recordCount: count,
    category,
    state,
  };
};

export const validateAuctionStatus = async (id) => {
  const isActive = await auctionCategory
    .findOne({ _id: id, status: false })
    .select({ _id: 0, status: 1 })
    .lean();

  return isActive;
};
