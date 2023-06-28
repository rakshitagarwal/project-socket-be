import { AsyncRouter } from 'express-async-router';
import { ENDPOINTS } from '../../common/constants';
import { productHandler } from './product.handlers';
import validateRequest from '../../middlewares/validateRequest';
import schema from './product.schemas';
export const productRoutes = AsyncRouter();

productRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    productHandler.add
);
productRoutes.get(ENDPOINTS.BASE + ':id?',
    validateRequest.params(schema.ZGetId),
    productHandler.get
);
productRoutes.patch(ENDPOINTS.BASE,
    validateRequest.body(schema.ZUpdate),
    productHandler.update);




