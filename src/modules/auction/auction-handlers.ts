import { Request, Response } from "express";
import { auctionService } from "./auction-services";

/**
 * Auction Creation
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const create = async (req: Request, res: Response) => {
    const response = await auctionService.create(
        req.body,
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

/**
 * Auction updation By Id
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const update = async (req: Request, res: Response) => {
    const response = await auctionService.update(
        req.body,
        req.params.id as string,
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

export const auctionHandler = {
    create,
    update,
};
