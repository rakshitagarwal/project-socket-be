import { Request, Response } from "express";
import { auctionService } from "./auction-services";

const create = async (req: Request, res: Response) => {
    const response = await auctionService.create(
        req.body,
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

export const auctionHandler = {
    create,
};
