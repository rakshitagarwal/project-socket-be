import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import prodCategoryHandler from "./product-category-handlers";
import validateRequest from "../../middlewares/validateRequest";
import schema from "./product-category-schemas";
export const productCategoryRoutes = Router();

productCategoryRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    prodCategoryHandler.add
);
productCategoryRoutes.get(
    ENDPOINTS.BASE + ":id?",
    validateRequest.params(schema.ZGetId),
    prodCategoryHandler.get
);
productCategoryRoutes.patch(
    ENDPOINTS.BASE + ":id?",
    validateRequest.params(schema.ZGetId),
    validateRequest.body(schema.ZUpdate),
    prodCategoryHandler.update
);

productCategoryRoutes.delete(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZDelete),
    prodCategoryHandler.removeMultipleId
);
