import { db } from "../../config/db";

/**
 * @description Get the country lists
 * @param name - name of the country
 * @param code -code of the country
 * @returns
 */
const getCountries = async (name: string, code: string) => {
    const countries = await db.countries.findMany({
        where: {
            name: {
                contains: name,
                mode: "insensitive",
            },
            code: {
                contains: code,
            },
        },
        select: {
            id: true,
            name: true,
            code: true,
            image: true,
        },
    });
    return countries;
};

export const locationQueries = {
    getCountries,
};
