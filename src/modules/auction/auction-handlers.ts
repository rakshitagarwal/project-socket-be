import { Request, Response } from "express";
import { auctionService } from "./auction-services";
import { IAuctionListing, IPagination } from "./typings/auction-types";

/**
 * Auction Creation
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
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
 */
const getById = async (req: Request, res: Response) => {
    const response = await auctionService.getById(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * Auction retrieve using pagination
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 * @return {Promise<Response>}
 */
const getAll = async (req: Request, res: Response) => {
    const response = await auctionService.getAll(
        req.query as Record<string, string> & IPagination
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
        res.locals.id
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

/**
 * fetching the bid-logs from auction_id
 * @param {Request} req
 * @param {Response }res
 */
const getBidLogs = async (req: Request, res: Response) => {
    const response = await auctionService.getBidLogs(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * Register Player in Auction
 * @param {Request} req
 * @param {Response }res
 */
const playerAuctionRegister = async (req: Request, res: Response) => {
    const response = await auctionService.playerRegister(req.body);
    res.status(response.code).json(response);
};

/**
 * Find a player with all registered auctions
 * @param {Request} req
 * @param {Response }res
 */
const getAllMyAuction = async (req: Request, res: Response): Promise<void> => {
    const response = await auctionService.getAllMyAuction(
        req.params.id as unknown as string,
        req.query as unknown as IPagination
    );
    res.status(response.code).json(
        JSON.parse(
            JSON.stringify(response, (_key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        )
    );
};

/**
 * Find a player registered with auction details
 * @param {Request} req
 * @param {Response }res
 */
const playerAuctionDetails = async (req: Request, res: Response) => {
    const response = await auctionService.playerAuctionDetails(
        req.query as unknown as { auction_id: string; player_id: string }
    );
    res.status(response.code).json(response);
};

/**
 * Start the auction with DateTime
 * @param {Request} req - request
 * @param {Response} res - response
 */
const startAuction = async (req: Request, res: Response) => {
    const response = await auctionService.startAuction(req.body);
    res.status(response.code).json(response);
};

/**
 * Purchase products from auction
 * @param {Request} req - request
 * @param {Response} res - response
 */
const purchase = async (req: Request, res: Response) => {
    const response = await auctionService.purchaseAuctionProduct(req.body);
    res.status(response.code).json(response);
};

/**
 * Start the random simulation
 * @param {Request} req
 * @param {Response} res
 */
const startSimulation = async (req: Request, res: Response) => {
    const response = await auctionService.startSimulation(req.body);
    res.status(response.code).json(response);
};

/**
 * Listing of the auction with registered players
 * @param {Request} req - Request
 * @param {Response} res - Response
 */
const auctionListing = async (req: Request, res: Response) => {
    const response = await auctionService.auctionLists(
        req.query as unknown as IAuctionListing
    );
    res.status(response.code).json(response);
};

/**
 * Auction retrieve By Id (Total)
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
const getByIdTotalAuction = async (req: Request, res: Response) => {
    const response = await auctionService.getByIdTotalAuction(req.params.id as string);
    res.status(response.code).json(response);
};

/**
 * Listing of the auction with registered Total
 * @param {Request} req - Request
 * @param {Response} res - Response
 */
const auctionListingTotal = async (req: Request, res: Response) => {
    const response = await auctionService.auctionListsTotal(
        req.query as unknown as IAuctionListing
    );
    res.status(response.code).json(response);
};

export const auctionHandler = {
    create,
    getById,
    getAll,
    update,
    remove,
    getBidLogs,
    playerAuctionRegister,
    getAllMyAuction,
    playerAuctionDetails,
    startAuction,
    purchase,
    startSimulation,
    auctionListing,
    getByIdTotalAuction,
    auctionListingTotal
};
