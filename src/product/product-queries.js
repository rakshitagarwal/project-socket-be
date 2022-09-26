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
    .where({ status: false });
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

export const getProducts = async (pages, limit) => {
  const count = await productCount();
  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  const products = await productModel
    .find({ status: false })
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

export const search = async (pages, limit, searchText) => {
  const count = await productCount();
  let totalPages;
  if (count < limit) {
    totalPages = 1;
  } else {
    totalPages = parseInt(count / limit);
  }

  if (searchText === "") {
    const product = await getProducts(pages, limit);
    return product;
  } else {
    const product = await productModel
      .find({
        title: { $regex: `^${searchText}`, $options: "i" },
        createdAt: {
          $lte: new Date().toISOString(),
        },
        status: false,
      })
      .limit(limit)
      .skip(limit * pages)
      .populate("ProductCategory", { name: 1, _id: 0 })
      .lean();

    return {
      products: product,
      pages: totalPages,
      limit: limit,
      currentPage: pages,
      recordCount: count,
      searchText: searchText,
    };
  }
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
