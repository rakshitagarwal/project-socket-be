import { AsyncRouter } from 'express-async-router';
import { ENDPOINTS } from '../../common/constants';
import { prodCategoryHandler } from './prodcategory.handlers';

export const productCategoryRoutes = AsyncRouter();

productCategoryRoutes.post(
    ENDPOINTS.BASE,
    prodCategoryHandler.add
);
productCategoryRoutes.get(ENDPOINTS.BASE + ':id?',
    prodCategoryHandler.get
);




