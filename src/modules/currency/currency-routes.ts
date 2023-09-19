import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import currencyHandler from "./currency-handlers";
import validateRequest from "../../middlewares/validateRequest";
import handleAsync from "express-async-handler";
import currencySchema from "./currency-schemas";

export const currencyRouter = Router();

currencyRouter.get(
    ENDPOINTS.BASE,
    validateRequest.query(currencySchema.findCurrency),
    handleAsync(currencyHandler.findOneCurrency)
);

currencyRouter.get(
    ENDPOINTS.ID,
    validateRequest.params(currencySchema.uuidSchema),
    handleAsync(currencyHandler.getOneCurrency)
);

currencyRouter.patch(
    ENDPOINTS.ID,
    validateRequest.params(currencySchema.uuidSchema),
    validateRequest.body(currencySchema.requestBodySchema),
    handleAsync(currencyHandler.updateCurrency)
);
