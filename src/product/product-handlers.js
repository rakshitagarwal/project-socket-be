import { createProduct } from "./product-services.js";

export const add = async (req, res) => {
  const { statusCode, response } = await createProduct(req.body);
  res.status(statusCode).json(response);
};
