import { db } from '../../config/db';
import { addReqBody, IPagination, Product, } from './typings/product.type';

const productQueries = (() => {
    const addNew = async function (product: addReqBody) {
        const queryResult = await db.product.create({
            data: {
                title: product.title,
                description: product.description,
                product_category_id: product.product_category_id,
                created_by: product.userId
            },
        }); return queryResult;
    };
    const getTitle = async function (title: string) {
        const queryResult = await db.product.findFirst({
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
        const queryResult = await db.product.findFirst({
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
    const getAllProduct = async function (
        metainfo: IPagination,
        where: { [key: string]: string | boolean | object }
    ) {
        const totalCount = await db.product.count({
            where: {
                title: {
                    contains: where.title
                        ? (where.title as string)
                        : '',
                    mode: 'insensitive',
                },
                is_deleted: false,
            },
        });
        console.log(totalCount);
        const queryResult = await db.product.findMany({
            where: {
                title: {
                    contains: where.title
                        ? (where.title as string)
                        : '',
                    mode: 'insensitive',
                },
                is_deleted: false,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
            },
            orderBy: { updated_at: 'desc' },
            skip: parseInt(`${metainfo.pageNum}`) * parseInt(`${metainfo.recordLimit}`) || 0,
            take: parseInt(`${metainfo.recordLimit}`) || 10,
        });
        return {
            queryResult,
            totalCount,
        };
    };
    const update = async function (updateInfo: Product) {
        if (updateInfo.id) {
            const queryResult = await db.product.update({
                where: {
                    id: updateInfo?.id,
                },
                data: {
                    ...updateInfo.changeDetails,
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
        const queryResult = await db.product.findFirst({
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
        // getAll,
        getAllProduct,
        update,
        getProdCategoryById
    };
})();

export default productQueries;
