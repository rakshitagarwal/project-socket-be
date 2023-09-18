// import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import currencyQueries from "./currency-queries";
import { currencyUpdate } from "./typings/currency-type";

const getAllCurrency = async () => {
    const result = await currencyQueries.getAllCurrency();
    if (result) return responseBuilder.okSuccess("all currencies", result);
    return responseBuilder.notFoundError("no currncy found");
};

const getOneCurrency = async (id: string | undefined) => {
    const result = await currencyQueries.getOneCurrency(id as string);
    if (result) return responseBuilder.okSuccess("one currency found", result);
    return responseBuilder.notFoundError("no such currency found");
};

const updateCurrency = async (id: string, change: currencyUpdate) => {
    if (id) {
        const result = await currencyQueries.updateCurrency(id, change);
        return responseBuilder.okSuccess("currency config updated successfully", result);
    }
    return responseBuilder.notFoundError("no such currency found");
};

const currencyService = {
    getAllCurrency,
    getOneCurrency,
    updateCurrency,
};

export default currencyService;
