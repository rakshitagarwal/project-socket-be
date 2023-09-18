import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import currencyHandler from "./currency-handlers";
// import validateRequest from "../../middlewares/validateRequest";
import handleAsync from "express-async-handler";

export const currencyRouter = Router();

currencyRouter.get(ENDPOINTS.BASE, handleAsync(currencyHandler.getAllCurrency));
currencyRouter.get(ENDPOINTS.ID, handleAsync(currencyHandler.getOneCurrency));
currencyRouter.patch(ENDPOINTS.ID, handleAsync(currencyHandler.updateCurrency));