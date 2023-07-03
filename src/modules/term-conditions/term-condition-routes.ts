import asyncHandler from "express-async-handler";
import { ENDPOINTS } from "../../common/constants";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import termAndConditionHandlers from "./term-condition-handlers";
import terAndConditonSchema from "./term-condition-schemas";

export const termAndConditionRouter: Router = Router();

termAndConditionRouter.post(
    ENDPOINTS.BASE,
    [validateRequest.body(terAndConditonSchema.create)],
    asyncHandler(termAndConditionHandlers.create)
);
termAndConditionRouter.put(
    ENDPOINTS.ID,
    [
        validateRequest.params(terAndConditonSchema.Id),
        validateRequest.body(terAndConditonSchema.update),
    ],
    asyncHandler(termAndConditionHandlers.update)
);
