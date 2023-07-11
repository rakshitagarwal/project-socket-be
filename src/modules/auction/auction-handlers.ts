import { Request, Response } from "express";
import { auctionService } from "./auction-services";
import { IPagination } from "./typings/auction-types";

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
 * Auction retrieve By Id
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const getById = async (req: Request, res: Response) => {
    const response = await auctionService.getById(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * Auction retrieve Many By Query
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const getAll = async (req: Request, res: Response) => {
    const response = await auctionService.getAll(
        req.query as unknown as IPagination
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

/**
 * Auction Remove By Id
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const remove = async (req: Request, res: Response) => {
    const response = await auctionService.remove(req.body.ids);
    res.status(response.code).json(response);
};

export const auctionHandler = {
    create,
    getById,
    getAll,
    update,
    remove,
};
