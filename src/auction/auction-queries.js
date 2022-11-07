import {
  auctionModel,
  auctionPreModel,
  auctionPostModel,
  auctionCategory,
} from "./../auction/auction-schemas.js";

export const auctionCategories = async () => {
  const categories = await auctionCategory
    .find({ status: true })
    .select({ _id: 1, name: 1 })
    .lean();
  return categories;
};

export const create = async (data) => {
  let { auctionPreRegister, auctionPostRegister, ...auction } = data;

  if (data.registerationStatus && data.postAuctionStatus) {
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

  if (!data.postAuctionStatus && data.registerationStatus) {
    let auctionData = await auctionModel.create(auction);
    let auctionPreData = await auctionPreModel.create({
      ...auctionPreRegister,
      Auction: auctionData._id,
    });
    return auctionData;
  }

  const auctionData = await auctionModel.insertMany(auction);
  return auctionData;
};

export const fetchAuction = async (page, limit, auctionType) => {
  let auctionData = [];

  // with auction type for filtering the differet types
  if (auctionType) {
    const auctionTypeCount = await auctionModel
      .find({
        state: auctionType,
        IsDeleted: true,
      })
      .countDocuments();

    let totalPages = Math.ceil(auctionTypeCount / limit);

    const auctions = await auctionModel
      .find({
        state: auctionType,
        IsDeleted: true,
      })
      .limit(limit)
      .skip(limit * page)
      .populate("Product", { _id: 1, title: 1 })
      .populate("AuctionCategory", { _id: 1, name: 1 })
      .lean();

    for (let i = 0; i < auctions.length; i++) {
      let id = auctions[i]._id;
      const auctionPreRegister = await auctionPreModel
        .findOne({ Auction: id })
        .where({ IsDeleted: true })
        .select({
          startDate: 1,
          endDate: 1,
          participantCount: 1,
          participantFees: 1,
        })
        .lean();

      const auctionPostRegister = await auctionPostModel
        .findOne({ Auction: id })
        .where({ IsDeleted: true })
        .select({ participantFees: 1 })
        .lean();

      auctionPreRegister || auctionPostRegister
        ? auctionData.push({
            ...auctions[i],
            auctionPreRegister,
            auctionPostRegister,
          })
        : auctionData.push({
            ...auctions[i],
          });
    }

    return {
      auctionData,
      auctionType,
      page: totalPages,
      limit: limit,
      currentPage: page,
      recordCount: auctionTypeCount,
    };
  }

  const count = await auctionModel.find({ IsDeleted: true }).countDocuments();
  let totalPages;
  totalPages = Math.ceil(count / limit);

  const auctions = await auctionModel
    .find({ IsDeleted: true })
    .limit(limit)
    .skip(limit * page)
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  for (let i = 0; i < auctions.length; i++) {
    let id = auctions[i]._id;
    const auctionPreRegister = await auctionPreModel
      .findOne({ Auction: id })
      .where({ IsDeleted: true })
      .select({
        startDate: 1,
        endDate: 1,
        participantCount: 1,
        participantFees: 1,
      })
      .lean();

    const auctionPostRegister = await auctionPostModel
      .findOne({ Auction: id })
      .where({ IsDeleted: true })
      .select({ participantFees: 1 })
      .lean();

    auctionPreRegister || auctionPostRegister
      ? auctionData.push({
          ...auctions[i],
          auctionPreRegister,
          auctionPostRegister,
        })
      : auctionData.push({
          ...auctions[i],
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
    .where({ IsDeleted: true })
    .populate("Product", { _id: 1, title: 1 })
    .populate("AuctionCategory", { _id: 1, name: 1 })
    .lean();

  if (!auction) {
    return auction;
  }

  const auctionPreRegister = await auctionPreModel
    .findOne({
      Auction: auction._id,
    })
    .where({ IsDeleted: true })
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
    .where({ IsDeleted: true })
    .select({ participantFees: 1, _id: 0 });

  if (auctionPreRegister || auctionPostRegister) {
    const auctions = {
      ...auction,
      auctionPreRegister,
      auctionPostRegister,
    };
    return auctions;
  }

  return auction;
};

export const putAuction = async (id, data) => {
  if (data.auctionPreRegister && data.auctionPostRegister) {
    const auction = await auctionModel.findByIdAndUpdate(id, data);
    const auctionPre = await auctionPreModel.findOneAndUpdate(
      { Auction: id },
      { ...data.auctionPreRegister, IsDeleted: true },
      { upsert: true, new: true }
    );
    const auctionpost = await auctionPostModel.findOneAndUpdate(
      { Auction: id },
      { ...data.auctionPostRegister, IsDeleted: true },
      { upsert: true, new: true }
    );
    if (auctionPre && auctionpost) return auction;
  }

  if (data.auctionPreRegister) {
    console.log("Before", data.auctionPreRegister);
    const auction = await auctionModel.findByIdAndUpdate(id, data);
    const auctionPre = await auctionPreModel.findOneAndUpdate(
      { Auction: id },
      { ...data.auctionPreRegister, IsDeleted: true },
      { upsert: true, new: true }
    );

    console.log("After", auctionPre);

    const auctionpost = await auctionPostModel.findOneAndUpdate(
      {
        Auction: id,
      },
      {
        IsDeleted: false,
      }
    );
    if (auctionPre || auctionpost) return auction;
  }

  if (!data.auctionPreRegister && !data.auctionPreRegister) {
    const auction = await auctionModel.findByIdAndUpdate(id, data);
    const auctionPre = await auctionPreModel.findOneAndUpdate(
      {
        Auction: id,
      },
      {
        IsDeleted: false,
      }
    );
    const auctionpost = await auctionPostModel.findOneAndUpdate(
      {
        Auction: id,
      },
      {
        IsDeleted: false,
      }
    );

    if (auctionPre || auctionpost || auction) return auction;
  }
};

export const softDelete = async (id) => {
  const auction = await auctionModel.findByIdAndUpdate(id, {
    IsDeleted: false,
  });
  await auctionPostModel.findOneAndUpdate(
    { Auction: id },
    { IsDeleted: false }
  );
  await auctionPreModel.findOneAndUpdate({ Auction: id }, { IsDeleted: false });

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
  totalPages = Math.ceil(count / limit);

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
    .findOne({ _id: id, status: true })
    .select({ _id: 0, status: 1 })
    .lean();

  return isActive;
};

export const checkProductAuction = async (productId) => {
  const products = await auctionModel.find({ Product: productId });
  return products;
};
