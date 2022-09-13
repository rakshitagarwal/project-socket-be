import { createProduct, deleteProduct } from "./product-services.js";

export const add = async (req, res) => {
  const data = { ...req?.body, image: req?.file?.path };
  const { statusCode, response } = await createProduct(data);
  res.status(statusCode).json(response);
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteProduct(req.query.id);
  res.status(statusCode).json(response);
};

export const update = async (req, res) => {
  const { statusCode, response } = await updateProduct(req.params.id, req.body);
  res.status(statusCode).json(response);
};

export const fetchProduct = (req, res) => {
  console.log(req.params.id);
};
