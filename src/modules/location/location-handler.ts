import { Request, Response } from "express";
import { locationService } from "./location-service";

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
    const response = locationService.currentLocation(
        req.clientIp as unknown as string
    );
    res.status(response.code).json(response);
};

export const locationHandler = {
    getCountry,
    currentLocation,
};
