import { Request, Response } from "express";
import { locationService } from "./location-service";
import { getClientIp } from "request-ip";

/**
 * @description Get the Countries
 * @param req - Request
 * @param res - Response
 */
const getCountry = async (req: Request, res: Response) => {
    const response = await locationService.searchCoutries(req.query);
    res.status(response.code).json(response);
};

/**
 * @description Get the Current Location
 * @param req - Request
 * @param res - Response
 */
const currentLocation = (req: Request, res: Response) => {
    const ipAddr = getClientIp(req);
    const response = locationService.currentLocation(ipAddr as string);
    res.status(response.code).json(response);
};

export const locationHandler = {
    getCountry,
    currentLocation,
};
