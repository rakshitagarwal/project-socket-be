import { Request, Response } from "express";
import { auctionCatgoryService } from "./auction-category-services";

/**
 * @param {Request} req  - Request object
 * @param {Response} res - Response object
 * @description - creation of the auction category creation
 * @return {Promise<Response>}
 */
const add = async (req: Request, res: Response) => {
    const response = await auctionCatgoryService.add(req.body);
    res.status(response.code).json(response);
};

/**
 * @param {Request} req  - Request object
 * @param {Response} res - Response object
 * @description - creation of the auction category creation
 * @return {Promise<Response>}
 */
const update = async (req: Request, res: Response) => {
    const response = await auctionCatgoryService.update(
        req.params.id as string,
        req.body
    );
    res.status(response.code).json(response);
};

/**
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @description - get the single auction category with all details
 * @return {Promise<Response>}
 */
const get = async (req: Request, res: Response) => {
    const response = await auctionCatgoryService.get(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @description - get auction catgories with all detials
 * @return {Promise<Response>}
 */
const getAll = async (req: Request, res: Response) => {
    const response = await auctionCatgoryService.getAll(
        req.query.search as string
    );
    res.status(response.code).json(response);
};

/**
 *
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @description - remove the multiple auction categories
 * @returns {Promise<Response>}
 */
const removeCategories = async (req: Request, res: Response) => {
    const response = await auctionCatgoryService.removeCategories(req.body);
    res.status(response.code).json(response);
};

export const auctionCategoryHandler = {
    add,
    update,
    get,
    getAll,
    removeCategories,
};
