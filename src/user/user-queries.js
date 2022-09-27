import { UserModel, UseRole, Persistence } from "./user-schemas.js";

export const create = async (user) => {
  const userMeta = await UserModel.create(user);
  return userMeta;
};
export const getEmailUser = async (user) => {
  const email = user.email;
  const emailUser = await UserModel.findOne({
    email: email,
    status: false,
  }).lean();
  return emailUser;
};
export const getRoleUser = async (user) => {
  const roleId = await UseRole.findOne({ name: user }).select({
    _id: 1,
  });
  if (roleId === null) {
    return false;
  }
  return roleId._id;
};
export const getUserById = async (id) => {
  const userMeta = await UserModel.findById(id).lean();
  return userMeta;
};
export const removeUser = async (id) => {
  const userMeta = await UserModel.findByIdAndUpdate(id, {
    status: true,
  }).lean();
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
export const persistence = async (genToken) => {
  const userMeta = await Persistence.create(genToken);
  return userMeta;
};
export const getRoleUsers = async (token) => {
  const roleId = await Persistence.findOne({ accessToken: token }).select({
    _id: 1,
  });
  if (roleId === null) {
    return false;
  }
  return roleId._id;
};
export const getUserByIdRole = async (id) => {
  const userMeta = await Persistence.findById(id).lean();
  return userMeta;
};

const USER_SELECT = {
  passcode: true,
  name: true,
  email: true,
  id: true,
};
export const findUserByEmail = async (email) => {
  const user = await UserModel.findOne({
    where: { email: { equals: email } },
    select: USER_SELECT,
  });
  return user;
};

export const setUserPasscode = async (user_id, passcode) => {
  console.log(user_id);
  const userToken = await Persistence.updateMany({
    where: { User: { equals: user_id } },
    passcode: passcode,
  });
  return userToken;
};
