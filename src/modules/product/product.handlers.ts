import { Request, Response } from 'express';
import productServices from './product.services';
import asyncHandler from 'express-async-handler';

class ProductHandler {

    /**
     * @description handler to add new Product 
     * @param { Request } req - request object
     * @param { Response } res - response object
     */
    add = asyncHandler(async (req: Request, res: Response) => {
        console.log("hhhhhhhhhhh", res.locals);

        const response = await productServices.add(req.body);
        res.status(response.code).json(response);
    })
    /**
     * @description get all or single Product 
     * @param { Request } req request object
     * @param { Response } res response object
     */
    get = asyncHandler(async (req: Request, res: Response) => {
        const response = await productServices.get(req.params.id);
        res.status(response.code).json(response);
    })
    /**
     * @description handler to update new Product 
     * @param { Request } req - request object
     * @param { Response } res - response object
     */
    update = asyncHandler(async (req: Request, res: Response) => {
        const response = await productServices.update(req.body);
        res.status(response.code).json(response);
    })
}
export const productHandler = new ProductHandler();
