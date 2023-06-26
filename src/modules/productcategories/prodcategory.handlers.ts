import { Request, Response } from 'express';
import prodCategoryServices from '../productcategories/prodcategory.services';
import asyncHandler from 'express-async-handler';

class ProductCategoryHandler {

    /**
     * @description handler to add new Product Category
     * @param { Request } req - request object
     * @param { Response } res - response object
     */
    add = asyncHandler(async (req: Request, res: Response) => {
        const response = await prodCategoryServices.add(req.body);
        res.status(response.code).json(response);
    })
    /**
  * @description get all or single Product Category
  * @param { Request } req request object
  * @param { Response } res response object
  * @returns { undefined }
  */
    get = asyncHandler(async (req: Request, res: Response) => {
        const response = await prodCategoryServices.get(req.params.id);
        res.status(response.code).json(response);
    })
}
export const prodCategoryHandler = new ProductCategoryHandler();
