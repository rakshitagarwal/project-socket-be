import { UserModel, UseRole } from "./user-schemas.js";

export const isExist = async function (emailAddress, passwordHash = null) {
  // TO-DO get user details from the db based by user's email address and password hash
};

export const create = async (user) => {
  console.log("::::::", user.email);
  const userMeta = await UserModel.create(user);
  return userMeta;
};
export const getEmailUser = async (user) => {
  const email = user.email;
  const emailUser = await UserModel.findOne({ email: email });
  return emailUser;
};
export const getRoleUser = async (user) => {
  const roleId = await UseRole.findOne({ name: "Admin" }).select({
    _id: 1,
  });
  return roleId._id;
};
export const getUserById = async (id) => {
  const userMeta = await UserModel.findById(id);
  return userMeta;
};
export const removeUser = async (id) => {
  const userMeta = await UserModel.findByIdAndUpdate(id, {
    status: true,
  });
  return userMeta;
};
export const update = async (id, userdata) => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, userdata);
  return updatedUser;
};
export const getAllUser = async (pages = 0, limit = 10) => {
  const counts = await UserModel.find({ status: false });
  const totalPages = Math.ceil(counts.length / limit);
  const users = await UserModel.find({ status: false })
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
