import { helpers } from "../helper/helpers.js";
import geoip from "geoip-lite";
import { createResponse } from "../common/utilies.js";
import { getAllCountrie } from "./location-queries.js";

export const getCurrentLocation = async (ipAddr) => {
  if (!ipAddr) {
    return createResponse(
      helpers.StatusCodes.INTERNAL_SERVER_ERROR,
      helpers.responseMessages.IP_NOT_FETCH_ADDR
    );
  }
  const location = geoip.lookup(ipAddr);
  if (location) {
    return createResponse(helpers.StatusCodes.OK, location);
  }
  return createResponse(
    helpers.StatusCodes.INTERNAL_SERVER_ERROR,
    helpers.responseMessages.IP_NOT_FETCH_LOCATION
  );
};

export const getAllCountries = async () => {
  const countries = await getAllCountrie();
  return createResponse(
    helpers.StatusCodes.OK,
    helpers.responseMessages.COUNTRY_CODE,
    countries
  );
};
