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
  const productMeta = await productModel.findById(id).where({ status: false });
  return productMeta;
};

export const removeProduct = async (id) => {
  const productMeta = await productModel.findByIdAndUpdate(id, {
    status: true,
  });
  return productMeta;
};

// all active products count
export const productCount = async () => {
  const count = await productModel.find({ status: false });
  return count.length;
};

export const getProducts = async (pages = 0, limit = 10) => {
  const count = await productCount();
  const totalPages = parseInt(count / limit);

  const products = await productModel
    .find({ status: false })
    .limit(limit)
    .skip(limit * pages);

  return {
    products: products,
    pages: totalPages,
    currentPage: pages,
    limit: limit,
  };
};
