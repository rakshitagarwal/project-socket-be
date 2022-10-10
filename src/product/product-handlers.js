import { convertToSpecificLang } from "../common/utilies.js";
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
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteProduct(req.params.id);
  res.status(statusCode).json(convertToSpecificLang(response, res));
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
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const select = async (req, res) => {
  const { statusCode, response } = await fetchProduct(
    parseInt(req.query.page),
    parseInt(req.query.limit)
  );

  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const selectProduct = async (req, res) => {
  const { statusCode, response } = await getProduct(req.params.id);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const selectCategories = async (req, res) => {
  const { statusCode, response } = await getCategories();
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const searchProduct = async (req, res) => {
  const { statusCode, response } = await findProduct(req.query);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};
