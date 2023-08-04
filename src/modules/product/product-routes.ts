import Router from "express";
import { ENDPOINTS } from "../../common/constants";
import productHandler from "./product-handlers";
import validateRequest from "../../middlewares/validateRequest";
import schema from "./product-schemas";
import handleAsync from "express-async-handler";

export const productRoutes = Router();

productRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    handleAsync(productHandler.add)
);
productRoutes.get(
    ENDPOINTS.BASE + ":id?",
    [
        validateRequest.params(schema.ZGetId),
        validateRequest.query(schema.Zpagination),
    ],
    handleAsync(productHandler.get)
);
productRoutes.patch(
    ENDPOINTS.BASE + ":id",
    [
        validateRequest.body(schema.ZUpdate),
        validateRequest.params(schema.ZGetId),
    ],
    handleAsync(productHandler.update)
);

productRoutes.delete(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZDelete),
    handleAsync(productHandler.removeMultipleId)
);
