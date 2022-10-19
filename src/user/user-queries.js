import { UserModel, UseRole, Persistence } from "./user-schemas.js";

export const create = async (user) => {
  const userData = await UserModel.create(user);
  return userData;
};

export const userExists = async (user) => {
  const emailUser = await UserModel.findOne({
    email: user,
    verified: true,
    status: false,
  })
    .lean()
    .populate("Role", { name: 1 });

  if (!emailUser) {
    return false;
  } else if (emailUser.isblock) {
    const data = await UserModel.findOne({ email: user, isblock: true });
    return data;
  }
  return emailUser;
};

export const emailVerfiedUser = async (user) => {
  const userEmail = await UserModel.findOne({
    email: user,
    verified: false,
    status: false,
  })
    .lean()
    .populate("Role", { name: 1 });
  return userEmail;
};
export const roleSchema = async (user) => {
  const roleId = await UseRole.findOne({ name: user }).select({
    _id: 1,
  });
  if (!roleId) {
    return false;
  }
  return roleId._id;
};

export const roleSchemaName = async (user) => {
  const roleId = await UseRole.findOne({ name: user }).select({
    name: 1,
  });
  if (!roleId) {
    return false;
  }
  return roleId;
};
export const roleSchemaFind = async (user) => {
  const roleId = await UseRole.find();
  if (!roleId) {
    return false;
  }
  return roleId[1];
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
export const getUserByIdVerfied = async (id) => {
  const userData = await UserModel.findById(id)
    .find({ status: false, verified: true })
    .lean()
    .populate("Role", { name: 1 });
  if (userData.length > 0) {
    return userData[0];
  }
  return false;
};
export const getResetUserById = async (id) => {
  const userData = await UserModel.findById(id).find({ verified: true }).lean();
  if (!userData) {
    return false;
  }
  return userData[0];
};

export const removeUser = async (id) => {
  const userData = await UserModel.findByIdAndUpdate(id, {
    status: true,
    verified: true,
  }).lean();
  if (!userData) {
    return false;
  }
  return userData;
};
export const update = async (id, userdata) => {
  const userUpdate = await UserModel.findByIdAndUpdate(id, userdata);
  return userUpdate;
};
export const getAllUser = async (pages = 0, limit = 10, roleName) => {
  const counts = await UserModel.find({ status: false }).lean();
  const totalPages = Math.ceil(counts.length / limit);
  const users = await UserModel.find({ status: false })
    .lean()
    .limit(limit)
    .populate("Role", { name: 1 })
    .skip(limit * pages);
  return {
    users: users,
    count: counts.length,
    pages: totalPages,
    currentPage: pages,
    limit: limit,
  };
};
export const getAllUserRole = async (pages = 0, limit = 10, roleId) => {
  const counts = await UserModel.find({ status: false, Role: roleId }).lean();
  const totalPages = Math.ceil(counts.length / limit);
  const users = await UserModel.find({ status: false, Role: roleId })
    .lean()
    .limit(limit)
    .populate("Role", { name: 1 })
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
  const userData = await Persistence.create(genToken);
  return userData;
};
export const getRoleAccessToken = async (token) => {
  const tokenId = await Persistence.findOne({ accessToken: token }).select({
    _id: 1,
  });
  if (!tokenId) {
    return false;
  }
  return tokenId._id;
};
export const getUserByIdRole = async (id) => {
  const userData = await Persistence.findById(id).lean();
  return userData;
};
export const userPassCodeUpdate = async (user_id, passcode) => {
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
export const getTokenUsers = async (passcode) => {
  const roleId = await UserModel.findOne({
    passcode: passcode,
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
  const tokenData = await Persistence.find({ accessToken: data });
  if (tokenData.length > 0) {
    return tokenData;
  }
  return false;
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
