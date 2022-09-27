import {
  addAuction,
  getAuctions,
  getCategory,
  updateAuction,
} from "./auction-services.js";

export const add = async (req, res) => {
  const { statusCode, response } = await addAuction(req.body);
  res.status(statusCode).json(response);
};

export const update = async () => {
  const { statusCode, response } = await updateAuction(req.body);
  res.status(statusCode).json(response);
};

export const fetchAll = async (req, res) => {
  const { statusCode, response } = await getAuctions();
  res.status(statusCode).json(response);
};

export const fetchCategories = async () => {
  const { statusCode, response } = await getCategory();
  res.status(statusCode).json(response);
};
