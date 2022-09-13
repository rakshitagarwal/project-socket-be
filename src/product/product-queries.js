import { productModel } from "./product-schemas.js";

export const create = async (product) => {
  const productMeta = await productModel.create(product);
  return productMeta;
};

export const update = async (id, product) => {
  const updatedProduct = await productModel.findByIdAndUpdate(id, product);
  return updatedProduct;
};

export const getProductById = async (id) => {
  const productMeta = await productModel.findById(id);
  return productMeta;
};
