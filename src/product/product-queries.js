import { productModel, productCategoryModel } from "./product-schemas.js";

export const create = async (product) => {
  const productMeta = await productModel.create(product);
  return productMeta;
};

export const update = async (id, product) => {
  const updatedProduct = await productModel.findByIdAndUpdate(id, product);
  return updatedProduct;
};

export const getProductById = async (id) => {
  const productMeta = await productModel
    .findById(id)
    .populate("ProductCategory", { name: 1, _id: 1 })
    .where({ status: false, IsDeleted: false });
  return productMeta;
};

export const removeProduct = async (id) => {
  const productMeta = await productModel.findByIdAndUpdate(id, {
    IsDeleted: true,
  });
  return productMeta;
};

export const getProducts = async (pages, limit) => {
  const count = await productModel.find({ IsDeleted: false }).countDocuments();

  totalPages = Math.ceil(count / limit);

  const products = await productModel
    .find({ IsDeleted: false })
    .limit(limit)
    .skip(limit * pages)
    .populate("ProductCategory", { name: 1, _id: 0 })
    .lean();

  return {
    products: products,
    pages: totalPages,
    limit: limit,
    currentPage: pages,
    recordCount: count,
  };
};

export const search = async (pages, limit, category, type) => {
  if (!category || !type) {
    const products = await getProducts(pages, limit);
    return products;
  }

  const count = await productModel.find({ IsDeleted: false }).countDocuments();

  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  totalPages = parseInt(count / limit);

  const product = await productModel
    .find({ IsDeleted: false })
    .limit(limit)
    .skip(limit * pages)
    .populate("ProductCategory", false, { name: category, type: type })
    .lean();

  return {
    products: product,
    pages: totalPages + 1,
    limit: limit,
    currentPage: pages,
    recordCount: count,
  };
};

export const getProductByTitle = async (title) => {
  const product = await productModel.findOne({ title: title, status: false });
  return product._id;
};

export const inActiveProductByTitle = async (title) => {
  const product = await productModel.findOne({ title: title, status: true });
  return product._id;
};

export const fetchAllCategory = async () => {
  const categories = await productCategoryModel
    .find({ status: false })
    .select({
      _id: 1,
      type: 1,
      name: 1,
    })
    .lean();
  return categories;
};

export const validateStatus = async (id) => {
  const isActive = await productModel
    .findOne({ _id: id, status: false })
    .select({ status: 1, _id: 0 })
    .lean();

  return isActive;
};

export const getCategoryById = async (id) => {
  const isActive = await productCategoryModel
    .findById(id)
    .select({ status: 1, _id: 1 })
    .lean();

  return isActive;
};
