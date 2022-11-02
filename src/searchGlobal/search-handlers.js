import { searchModule } from "./search-services.js";
import { convertToSpecificLang } from "../common/utilies.js";

export const searchGlobal = async (req, res) => {
  const { statusCode, response } = await searchModule(req.query);
  res.status(statusCode).json(response);
};
