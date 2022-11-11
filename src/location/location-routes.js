import { Router } from "express";
import { currentLocation ,countriesHandler} from "./location-handlers.js";
export const locationRouter = Router();
locationRouter
  .get("/location", currentLocation)
  .get("/countries", countriesHandler);
