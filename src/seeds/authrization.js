import { authSchemas } from "../roles/role-schema.js";
import { helpers } from "../helper/helpers.js";
import { connectDB } from "../config/db.js";
import { productCategoryModel } from "../product/product-schemas.js";

const roles = async () => {
  connectDB();
  await authSchemas.roleSchema.deleteMany({});
  const data = await authSchemas.roleSchema.insertMany(helpers.roles);
  console.log("role inserted");
};

roles();
console.log("worked");
