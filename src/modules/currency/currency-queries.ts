import { db } from "../../config/db";
import { currencyUpdate } from "./typings/currency-type";

const getAllCurrency = async () => {
    const queryResult = await db.currency.findMany();
    return queryResult;
};

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
    updateCurrency,
};
export default currencyQueries;
