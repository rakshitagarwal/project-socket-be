import { getClientIp } from "request-ip";
import { convertToSpecificLang } from "../common/utilies.js";
import { getCurrentLocation, getAllCountries } from "./location-services.js";

export const currentLocation = async (req, res) => {
  const ipAddrSocket = getClientIp(req)
    ? getClientIp(req)
    : req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress;
  const { statusCode, response } = await getCurrentLocation(ipAddrSocket);
  res.status(statusCode).json(convertToSpecificLang(response, res));
};
export const countriesHandler = async (req, res) => {
  const { statusCode, response } = await getAllCountries();
  res.status(statusCode).json(convertToSpecificLang(response, res));
};
