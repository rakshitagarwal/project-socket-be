import asyncHandler from "express-async-handler";
import { ENDPOINTS } from "../../common/constants";
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import termAndConditionHandlers from "./term-condition-handlers";
import termAndConditonSchema from "./term-condition-schemas";

export const termAndConditionRouter: Router = Router();

termAndConditionRouter.post(
    ENDPOINTS.BASE,
    [validateRequest.body(termAndConditonSchema.create)],
    asyncHandler(termAndConditionHandlers.create)
);
termAndConditionRouter.put(
    ENDPOINTS.ID,
    [
        validateRequest.params(termAndConditonSchema.Id),
        validateRequest.body(termAndConditonSchema.update),
    ],
    asyncHandler(termAndConditionHandlers.update)
);
termAndConditionRouter.get(
    ENDPOINTS.ID,
    [validateRequest.params(termAndConditonSchema.Id)],
    asyncHandler(termAndConditionHandlers.getById)
);
termAndConditionRouter.delete(
    ENDPOINTS.ID,
    [validateRequest.params(termAndConditonSchema.Id)],
    asyncHandler(termAndConditionHandlers.deleteById)
);
termAndConditionRouter.get(
    ENDPOINTS.BASE,
    [validateRequest.query(termAndConditonSchema.pagination)],
    asyncHandler(termAndConditionHandlers.getAllTermAndCondition)
);
