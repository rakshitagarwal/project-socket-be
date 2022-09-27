import { getAuctionById } from "./auction-queries.js";
import {
  addAuction,
  getAuctions,
  getCategory,
  updateAuction,
  deleteAuction,
  fetchAuctionById,
  searchByQuery,
} from "./auction-services.js";

export const add = async (req, res) => {
  const { statusCode, response } = await addAuction(req.body);
  res.status(statusCode).json(response);
};

export const update = async (req, res) => {
  const { statusCode, response } = await updateAuction(req.params.id, req.body);
  res.status(statusCode).json(response);
};

export const fetchAll = async (req, res) => {
  const { statusCode, response } = await getAuctions(req.query);
  res.status(statusCode).json(response);
};

export const fetchCategories = async (req, res) => {
  const { statusCode, response } = await getCategory();
  res.status(statusCode).json(response);
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteAuction(req.params.id);
  res.status(statusCode).json(response);
};

export const selectAuction = async (req, res) => {
  const { statusCode, response } = await fetchAuctionById(req.params.id);
  res.status(statusCode).json(response);
};

export const searchAuction = async (req, res) => {
  const { statusCode, response } = await searchByQuery(req.query);
  res.status(statusCode).json(response);
};
