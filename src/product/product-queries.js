import { productModel } from "./product-schemas.js";

export const create = async () => {
  const product = await productModel.create(product);
  return product;
};
