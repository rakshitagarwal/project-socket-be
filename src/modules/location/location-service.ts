import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import { ICountry } from "../users/typings/user-types";
import { locationQueries } from "./location-queries";
import geoip from "geoip-lite";

/**
 * @description Search the countries
 * @param search
 */
const searchCoutries = async (search: ICountry) => {
    let name = "";
    let code = "";
    if (search.name) {
        name = search.name;
    }
    if (search.code) {
        code = search.code;
    }
    const countries = await locationQueries.getCountries(name, code);
    return responseBuilder.okSuccess(MESSAGES.ALL.COUNTRY, countries);
};

/**
 * @description Get the user IpAddress
 * @param ipAddr - User IpAddr
 */
const currentLocation = (ipAddr: string) => {
    if (!ipAddr)
        return responseBuilder.notFoundError(MESSAGES.ALL.IP_ADDR_NOT_FOUND);
    const location = geoip.lookup(ipAddr);
    if (location) {
        return responseBuilder.okSuccess(
            MESSAGES.ALL.CURRENT_LOCATION,
            location
        );
    }
    return responseBuilder.notFoundError(MESSAGES.ALL.LOCATION_NOT_FOUND);
};

export const locationService = {
    searchCoutries,
    currentLocation,
};
