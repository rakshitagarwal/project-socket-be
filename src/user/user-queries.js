import { UserModel, UseRole } from "./user-schemas.js";

export const isExist = async function (emailAddress, passwordHash = null) {
  // TO-DO get user details from the db based by user's email address and password hash
};

export const create = async (user) => {
  const userMeta = await UserModel.create(user);
  return userMeta;
};
export const getRoleUser = async (user) => {
  const roleId = await UseRole.findOne({ name: "Admin" }).select({
    _id: 1,
  });
  return roleId._id;
};
export const getUserById = async (id) => {
  const productMeta = await UserModel.findById(id);
  return productMeta;
};
export const removeUser = async (id) => {
  const userMeta = await UserModel.findByIdAndDelete(id, {
    status: true,
  });
  return userMeta;
};
