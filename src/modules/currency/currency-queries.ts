import { db } from "../../config/db";
import { ICurrencyType, currencyUpdate } from "./typings/currency-type";

/**
 * @description getAllCurrency is used to get all currencies
 * @returns {queryResult} - the result of execution of query.
 */
const getAllCurrency = async () => {
    const queryResult = await db.currency.findMany();
    return queryResult;
};

/**
 * @description getOneCurrency is used to find one currency based on its id.
 * @param {string} id - id of currency to find its details.
 * @returns {queryResult} - the result of execution of query.
 */
const getOneCurrency = async (id: string) => {
    const queryResult = await db.currency.findFirst({
        where: { id: id },
        select: {
            id: true,
            currency_type: true,
            bid_increment: true,
            status: true,
            big_token: true,
            usdt: true,
            usdc: true,
            created_at: true,
            updated_at: true,
        },
    });
    return queryResult;
};

/**
 * @description findOneCurrency is used to find one currency based on its currency type.
 * @param {ICurrencyType} code - code contains currency_type to find one specific currency.
 * @returns {queryResult} - the result of execution of query.
 */
const findOneCurrency = async (code: ICurrencyType) => {
    const queryResult = await db.currency.findFirst({
        where: { currency_type: code.currency_code },
        select: {
            id: true,
            currency_type: true,
            bid_increment: true,
            status: true,
            big_token: true,
            usdt: true,
            usdc: true,
            created_at: true,
            updated_at: true,
        },
    });
    return queryResult;
};

/**
 * @description updateCurrency is used to update one currency details
 * @param {string} id - id of currency to find its details.
 * @param {currencyUpdate} change - the changes which will be updated in currency.
 * @returns {queryResult} - the result of execution of query.
 */
const updateCurrency = async (id: string, change: currencyUpdate) => {
    const queryResult = await db.currency.update({
        where: { id: id },
        data: {
            ...change,
            updated_at: new Date(),
        },
    });
    return queryResult;
};

const currencyQueries = {
    getAllCurrency,
    getOneCurrency,
    findOneCurrency,
    updateCurrency,
};
export default currencyQueries;
