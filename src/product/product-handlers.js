import {
  createProduct,
  deleteProduct,
  updateProduct,
  fetchProduct,
  getProduct,
  getCategories,
  findProduct,
} from "./product-services.js";

export const add = async (req, res) => {
  const { statusCode, response } = await createProduct(req.body);
  res.status(statusCode).json(response);
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteProduct(req.params.id);
  res.status(statusCode).json(response);
};

export const update = async (req, res) => {
  let updateProductData = req.body;
  if (req.file) {
    updateProductData = { ...req?.body, image: req.file.path };
  }
  const { statusCode, response } = await updateProduct(
    req.params.id,
    updateProductData
  );
  res.status(statusCode).json(response);
};

export const select = async (req, res) => {
  const { statusCode, response } = await fetchProduct(
    parseInt(req.query.page || 0),
    parseInt(req.query.limit || 0)
  );

  res.status(statusCode).json(response);
};

export const selectProduct = async (req, res) => {
  const { statusCode, response } = await getProduct(req.params.id);
  res.status(statusCode).json(response);
};

export const selectCategories = async (req, res) => {
  const { statusCode, response } = await getCategories();
  res.status(statusCode).json(response);
};

export const searchProduct = async (req, res) => {
  const { statusCode, response } = await findProduct(req.query);
  res.status(statusCode).json(response);
};
