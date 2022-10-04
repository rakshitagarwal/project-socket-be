import { UserModel, UseRole, Persistence } from "./user-schemas.js";

export const create = async (user) => {
  const userMeta = await UserModel.create(user);
  return userMeta;
};

export const getEmailUser = async (user) => {
  const emailUser = await UserModel.findOne({
    email: user,
    verified: true,
    status: false,
  })
    .lean()
    .populate("Role", { name: 1 });
  if (!emailUser) {
    return false;
  }
  return emailUser;
};
export const getEmailUsers = async (user) => {
  const emailUser = await UserModel.findOne({
    email: user,
    verified: false,
    status: false,
  })
    .lean()
    .populate("Role", { name: 1 });

  return emailUser;
};
export const getRoleUser = async (user) => {
  const roleId = await UseRole.findOne({ name: user }).select({
    _id: 1,
  });
  if (!roleId) {
    return false;
  }
  return roleId._id;
};
export const getUserById = async (id) => {
  const userMeta = await UserModel.findById(id)
    .find({ verified: false })
    .lean();
  if (!userMeta) {
    return false;
  }
  return userMeta[0];
};
export const getUserUpdateById = async (id) => {
  const userMeta = await UserModel.findById(id).find({ verified: true }).lean();
  if (!userMeta) {
    return false;
  }
  return userMeta[0];
};
export const getResetUserById = async (id) => {
  const userMeta = await UserModel.findById(id).find({ verified: true }).lean();
  if (!userMeta) {
    return false;
  }
  return userMeta[0];
};

export const removeUser = async (id) => {
  const userMeta = await UserModel.findByIdAndUpdate(id, {
    status: false,
    verified: true,
  }).lean();
  if (!userMeta) {
    return false;
  }
  return userMeta;
};
export const update = async (id, userdata) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userdata);
  return updatedUser;
};
export const getAllUser = async (pages = 0, limit = 10) => {
  const counts = await UserModel.find({ status: false }).lean();
  const totalPages = Math.ceil(counts.length / limit);
  const users = await UserModel.find({ status: false })
    .lean()
    .limit(limit)
    .skip(limit * pages);
  return {
    users: users,
    count: counts.length,
    pages: totalPages,
    currentPage: pages,
    limit: limit,
  };
};
export const updatePass = async (id, userdata) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userdata);
  return updatedUser;
};
export const persistence = async (genToken) => {
  const userMeta = await Persistence.create(genToken);
  return userMeta;
};
export const getRoleUsers = async (token) => {
  const roleId = await Persistence.findOne({ accessToken: token }).select({
    _id: 1,
  });
  if (!roleId) {
    return false;
  }
  return roleId._id;
};
export const getUserByIdRole = async (id) => {
  const userMeta = await Persistence.findById(id).lean();
  return userMeta;
};

export const setUserPasscode = async (user_id, passcode) => {
  const userDetails = await UserModel.findByIdAndUpdate(user_id, {
    passcode: passcode,
    status: false,
  });

  return userDetails;
};
export const setUserReset = async (user_id) => {
  const userDetails = await UserModel.findByIdAndUpdate(user_id, {
    flag: true,
  });
  return userDetails;
};
export const getTokenUsers = async (data) => {
  const roleId = await UserModel.findOne({
    passcode: data,
    verified: false,
  });
  if (!roleId) {
    return false;
  }
  return roleId;
};
export const getPasscodeUsers = async (data) => {
  const roleId = await UserModel.findOne({
    passcode: data,
    status: false,
  });
  if (!roleId) {
    return false;
  }
  return roleId;
};

export const removeTokenUser = async (data) => {
  const roleId = await Persistence.remove({ _id: data });
  if (!roleId) {
    return false;
  }
  return roleId;
};

export const getPersistenaceUsers = async (data) => {
  const roleId = await Persistence.find({ Role: data });
  return roleId;
};
export const getJwtTokenUsers = async (data) => {
  const roleId = await Persistence.find({ accessToken: data });
  if (roleId[0] === undefined) {
    return false;
  }
  return roleId;
};
export const getTokenRemoveByIdUser = async (id) => {
  const roleId = await Persistence.deleteOne(id).lean();
  if (roleId.deletedCount === 1) {
    return true;
  }
  return false;
};

export const restUserRemove = async (data) => {
  const user = await UserModel.deleteOne({ passcode: data });
};
export const search = async (pages, limit, filters) => {};
