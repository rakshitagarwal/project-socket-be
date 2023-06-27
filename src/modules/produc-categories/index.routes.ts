import { AsyncRouter } from 'express-async-router';
import { ENDPOINTS } from '../../common/constants';
import { prodCategoryHandler } from './product-category.handlers';
import validateRequest from '../../middlewares/validateRequest';
import schema from './product-category.schemas';
export const productCategoryRoutes = AsyncRouter();

productCategoryRoutes.post(
    ENDPOINTS.BASE,
    validateRequest.body(schema.ZNewAdd),
    prodCategoryHandler.add
);
productCategoryRoutes.get(ENDPOINTS.BASE + ':id?',
    validateRequest.params(schema.ZGetId),
    prodCategoryHandler.get
);
productCategoryRoutes.patch(ENDPOINTS.BASE,
    validateRequest.body(schema.ZUpdate),
    prodCategoryHandler.update);




