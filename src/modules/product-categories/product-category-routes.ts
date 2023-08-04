import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import prodCategoryHandler from "./product-category-handlers";
import validateRequest from "../../middlewares/validateRequest";
import schema from "./product-category-schemas";
import handleAsync from "express-async-handler";

export const productCategoryRoutes = Router();

productCategoryRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    handleAsync(prodCategoryHandler.add)
);

productCategoryRoutes.get(
    ENDPOINTS.BASE + ":id?",
    validateRequest.params(schema.ZGetId),
    handleAsync(prodCategoryHandler.get)
);

productCategoryRoutes.patch(
    ENDPOINTS.BASE + ":id?",
    [
        validateRequest.params(schema.ZGetId),
        validateRequest.body(schema.ZUpdate),
    ],
    handleAsync(prodCategoryHandler.update)
);

productCategoryRoutes.delete(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZDelete),
    handleAsync(prodCategoryHandler.removeMultipleId)
);
