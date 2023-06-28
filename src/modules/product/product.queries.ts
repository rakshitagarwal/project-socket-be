import { db } from '../../config/db';
import { addReqBody, Product, } from './typings/product.type';

const productQueries = (() => {
    const addNew = async function (product: addReqBody) {
        const queryResult = await db.product.create({
            data: {
                title: product.title,
                description: product.description,
                product_category_id: product.product_category_id,
                created_by: "123"
            },
        }); return queryResult;
    };
    const getTitle = async function (title: string) {
        const queryResult = await db.masterProductCategory.findFirst({
            where: {
                AND: {
                    title: {
                        contains: title ? title : '',
                        mode: 'insensitive'
                    },
                    status: true
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
    const getById = async function (id: string) {
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
    const getAll = async function () {
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
            orderBy: { updated_at: 'desc' },
        });
        return { queryResult };
    };
    const update = async function (updateInfo: Product) {
        if (updateInfo.id) {
            const queryResult = await db.masterProductCategory.update({
                where: {
                    id: updateInfo?.id,
                },
                data: {
                    ...updateInfo.changeDetails,
                    // updated_by: updateInfo.updated_by,
                },
                select: {
                    id: true,
                    title: true,
                    status: false,
                    created_at: false,
                    updated_at: false,
                }
            }); return queryResult;
        } return false;
    };
    const getProdCategoryById = async function (id: string) {
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
    };
    return {
        addNew,
        getTitle,
        getById,
        getAll,
        update,
        getProdCategoryById
    };
})();

export default productQueries;
