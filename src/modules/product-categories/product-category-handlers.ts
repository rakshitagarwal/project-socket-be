import { Request, Response } from 'express';
import prodCategoryServices from './product-category-services';
import asyncHandler from 'express-async-handler';

/**
 * @description handler to add new Product Category
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const add = asyncHandler(async (req: Request, res: Response) => {
    const response = await prodCategoryServices.add(req.body);
    res.status(response.code).json(response);
})
/**
 * @description get all or single Product Category
 * @param { Request } req request object 
 * @param { Response } res response object
 */
const get = asyncHandler(async (req: Request, res: Response) => {
    const response = await prodCategoryServices.get(req.params.id, {
        title: req.query.title ? (req.query.title as string) : '',
    });
    res.status(response.code).json(response);
})

/**
 * @description handler to update new Product Category
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const update = asyncHandler(async (req: Request, res: Response) => {
    const response = await prodCategoryServices.update(req.params, req.body);
    res.status(response.code).json(response);
})

/**
 * @description handler to multiple Delete new Product category
 * @param { Request } req - request object
 * @param { Response } res - response object
 */
const removeMultipleId = asyncHandler(async (req: Request, res: Response) => {
    // const getmultipleIds =await prodCategoryServices.
    const response = await prodCategoryServices.removeMultipleId(req.body);
    res.status(response.code).json(response);
})

const ProductCategoryHandler = {
    get,
    add,
    update,
    removeMultipleId
}

export default ProductCategoryHandler