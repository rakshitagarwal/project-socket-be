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

export const auctionCategooryHandler = {
    add,
    update,
};
