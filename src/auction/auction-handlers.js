import { convertToSpecificLang } from "../common/utilies.js";
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
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const update = async (req, res) => {
  const { statusCode, response } = await updateAuction(req.params.id, req.body);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const fetchAll = async (req, res) => {
  const { statusCode, response } = await getAuctions(req.query);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const fetchCategories = async (req, res) => {
  const { statusCode, response } = await getCategory();
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const remove = async (req, res) => {
  const { statusCode, response } = await deleteAuction(req.params.id);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const selectAuction = async (req, res) => {
  const { statusCode, response } = await fetchAuctionById(req.params.id);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};

export const searchAuction = async (req, res) => {
  const { statusCode, response } = await searchByQuery(req.query);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};
