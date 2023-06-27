import { AsyncRouter } from 'express-async-router';
import { ENDPOINTS } from '../../common/constants';
import { prodCategoryHandler } from './product-category.handlers';

export const productCategoryRoutes = AsyncRouter();

productCategoryRoutes.post(
    ENDPOINTS.BASE,
    prodCategoryHandler.add
);
productCategoryRoutes.get(ENDPOINTS.BASE + ':id?',
    prodCategoryHandler.get
);
productCategoryRoutes.patch(ENDPOINTS.BASE, prodCategoryHandler.update)




