import { db } from '../../config/db';
import { AddProdCategoryReqBody } from './typings/prodcategory.type';

const prodCategoryQueries = (() => {
    const addNewProdCategory = async function (prodCategory: AddProdCategoryReqBody) {
        const queryResult = await db.masterProductCategory.create({
            data: {
                title: prodCategory.title
            },
        }); return queryResult;
    };
    const getProdCategorytitle = async function (title: string) {
        const queryResult = await db.masterProductCategory.findFirst({
            where: {
                AND: {
                    title: title,
                    status: true,
                },
            },
            select: {
                id: true,
                status: true,
                updated_at: true,
            },
        });
        return queryResult;
    };
    const getProductCategoryById = async function (id: string) {
        const queryResult = await db.masterProductCategory.findFirst({
            where: {
                AND: {
                    id: id,
                    status: true,
                },
            },
            select: {
                id: true,
                title: true,
                status: true,
                updated_at: true,
            },
        });
        return queryResult ? queryResult : false
        // return queryResult;
    };
    const getAllProductCategory = async function () {
        const queryResult = await db.masterProductCategory.findMany({
            where: {
                status: true,
            },
            select: {
                id: true,
                title: true,
                status: true,
                created_at: false,
                updated_at: false,
            },
        });
        return { queryResult };
    };
    return {
        addNewProdCategory,
        getProdCategorytitle,
        getProductCategoryById,
        getAllProductCategory
    };
})();

export default prodCategoryQueries;
