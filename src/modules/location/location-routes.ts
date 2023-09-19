import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import asyncHandler from "express-async-handler";
import { locationSchemas } from "./location-schema";
import { locationHandler } from "./location-handler";

export const locationRouter = Router();

locationRouter.get(
    ENDPOINTS.COUNTRIES,
    [validateRequest.query(locationSchemas.countries)],
    asyncHandler(locationHandler.getCountry)
);

locationRouter.get(ENDPOINTS.CURRENT_LOCATION, locationHandler.currentLocation);
