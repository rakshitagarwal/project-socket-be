import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import currencyQueries from "./currency-queries";
import { ICurrencyType, currencyUpdate } from "./typings/currency-type";

/**
 * @description getOneCurrency is used to give details of one currency.
 * @param {string} id - id of currency to find its details.
 * @returns {object} - the response object using responseBuilder.
 */
const getOneCurrency = async (id: string | undefined) => {
    const result = await currencyQueries.getOneCurrency(id as string);
    if (result) return responseBuilder.okSuccess(MESSAGES.CURRENCY.CURRENCY_FOUND, result);
    return responseBuilder.notFoundError(MESSAGES.CURRENCY.CURRENCY_NOT_FOUND);
};

/**
 * @description findOneCurrency is used to find one currency when data is available or find all currencies.
 * @param {ICurrencyType} currency_code - currency_code to find one currency details
 * @returns {object} - the response object using responseBuilder.
 */
const findOneCurrency = async (currency_code: ICurrencyType) => {
    if (JSON.stringify(currency_code) === "{}") {
        const result = await currencyQueries.getAllCurrency();
        if (result) return responseBuilder.okSuccess(MESSAGES.CURRENCY.CURRENCY_ALL, result);
        return responseBuilder.notFoundError(MESSAGES.CURRENCY.CURRENCY_NOT_FOUND);
    }
    const result = await currencyQueries.findOneCurrency(currency_code);
    if (result) return responseBuilder.okSuccess(MESSAGES.CURRENCY.CURRENCY_FOUND, result);
    return responseBuilder.notFoundError(MESSAGES.CURRENCY.CURRENCY_NOT_FOUND);
};

/**
 * @description updateCurrency is used to update details of one currency
 * @param {string} id - id of currency to find its details.
 * @param {currencyUpdate} change - the changes which will be updated in currency.
 * @returns {object} - the response object using responseBuilder.
 */
const updateCurrency = async (id: string, change: currencyUpdate) => {
    if (id) {
        const result = await currencyQueries.updateCurrency(id, change);
        if (result) return responseBuilder.okSuccess(MESSAGES.CURRENCY.CURRENCY_UPDATED, result);
        return responseBuilder.notFoundError(MESSAGES.CURRENCY.CURRENCY_NOT_FOUND);
    }
    return responseBuilder.notFoundError(MESSAGES.CURRENCY.CURRENCY_NOT_FOUND);
};

const currencyService = {
    getOneCurrency,
    findOneCurrency,
    updateCurrency,
};

export default currencyService;
