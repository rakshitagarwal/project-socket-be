import { Response, Request } from "express";
import currencyService from "./currency-services";
import { ICurrencyType, currencyUpdate } from "./typings/currency-type";

/**
 * @description Get one currency based on its id.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getOneCurrency = async (req: Request, res: Response) => {
    const response = await currencyService.getOneCurrency(req.params.id);
    res.status(response.code).json(response);
};

/**
 * @description Find one currency if currency type is provided or find all currencies.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const findOneCurrency = async (req: Request, res: Response) => {
    const response = await currencyService.findOneCurrency(req.query as unknown as ICurrencyType);
    res.status(response.code).json(response);
};

/**
 * @description Update one currency details with data in body and id in params.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const updateCurrency = async (req: Request, res: Response) => {
    const response = await currencyService.updateCurrency(req.params.id as unknown as string, req.body as unknown as currencyUpdate);
    res.status(response.code).json(response);
};

const currencyHandler = {
    getOneCurrency,
    findOneCurrency,
    updateCurrency,
};
export default currencyHandler;
