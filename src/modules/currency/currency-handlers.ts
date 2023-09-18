import { Response, Request } from "express";
import currencyService from "./currency-services";
import { currencyUpdate } from "./typings/currency-type";

const getAllCurrency = async (_req: Request, res: Response) => {
    const response = await currencyService.getAllCurrency();
    res.status(response.code).json(response);
};

const getOneCurrency = async (req: Request, res: Response) => {
    const response = await currencyService.getOneCurrency(req.params.id);
    res.status(response.code).json(response);
};

const updateCurrency = async (req: Request, res: Response) => {
    const response = await currencyService.updateCurrency(req.params.id as unknown as string, req.body as unknown as currencyUpdate);
    res.status(response.code).json(response);
};

const currencyHandler = {
    getAllCurrency,
    getOneCurrency,
    updateCurrency,
};
export default currencyHandler;
