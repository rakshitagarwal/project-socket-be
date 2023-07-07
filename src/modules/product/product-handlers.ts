import { Request, Response } from 'express';
import productServices from './product-services';
import asyncHandler from 'express-async-handler';
import { IPagination, Iid } from './typings/product-type';

/**
 * @description handler to add new Product 
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const add = asyncHandler(async (req: Request, res: Response) => {
    const response = await productServices.add(req.body, res.locals.id as string);
    res.status(response.code).json(response);
})

/**
 * @description get all or single Product 
 * @param { Request } req request object
 * @param { Response } res response object
 */
const get = asyncHandler(async (req: Request, res: Response) => {
    const response = await productServices.get(req.params as unknown as Iid, req.query as unknown as IPagination);
    res.status(response.code).json(response);
})
/**
 * @description handler to update new Product 
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const update = asyncHandler(async (req: Request, res: Response) => {
    const response = await productServices.update(req.body);
    res.status(response.code).json(response);
})
/**
 * @description handler to multiple Delete new Product 
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const removeMultipleId = asyncHandler(async (req: Request, res: Response) => {
    const response = await productServices.removeMultipleId(req.body);
    res.status(response.code).json(response);
})
const productHandler = {
    add,
    update,
    get,
    removeMultipleId
}
export default productHandler