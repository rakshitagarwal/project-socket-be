import { Request, Response } from "express";
import { auctionService } from "./auction-services";

const create = async (req: Request, res: Response) => {
    const response = await auctionService.create(
        req.body,
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

const getById = async (req: Request, res: Response) => {    
    const response = await auctionService.getById(req.params.id as string,);
    res.status(response.code).json(response);
};

const getAll = async (_req: Request, res: Response) => {        
    const response = await auctionService.getAll();
    res.status(response.code).json(response);
};

export const auctionHandler = {
    create,
    getById,
    getAll,
};
