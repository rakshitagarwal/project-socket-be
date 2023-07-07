import Router from 'express';
import { ENDPOINTS } from '../../common/constants';
import productHandler from './product-handlers';
import validateRequest from '../../middlewares/validateRequest';
import schema from './product-schemas';
export const productRoutes = Router();

productRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    productHandler.add
);
productRoutes.get(ENDPOINTS.BASE + ':id?',
    [validateRequest.params(schema.ZGetId), validateRequest.query(schema.Zpagination)],
    productHandler.get
);
productRoutes.patch(ENDPOINTS.BASE + ':id',
    [validateRequest.body(schema.ZUpdate), validateRequest.params(schema.ZGetId)],
    productHandler.update);

productRoutes.delete(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZDelete),
    productHandler.removeMultipleId
);