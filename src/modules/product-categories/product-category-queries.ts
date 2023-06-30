import { db } from '../../config/db';
import { addReqBody, updateReqBody } from './typings/product-category-type';

const addNew = async (prodCategory: addReqBody) => {
    const queryResult = await db.masterProductCategory.create({
        data: {
            title: prodCategory.title
        },
    }); return queryResult;
};
const getTitle = async (title: string) => {
    const queryResult = await db.masterProductCategory.findFirst({
        where: {
            AND: {
                title: {
                    contains: title ? title : '',
                    mode: 'insensitive'
                },
                status: true,
                is_deleted: false
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
const getById = async (id: string) => {
    const queryResult = await db.masterProductCategory.findFirst({
        where: {
            AND: {
                id: id,
                status: true,
                is_deleted: false
            },
        },
        select: {
            id: true,
            title: true,
            status: true,
            updated_at: true,
        },
    });
    return queryResult
};
const getAll = async (title: string) => {
    const queryResult = await db.masterProductCategory.findMany({
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
            title: true,
            status: true,
            created_at: false,
            updated_at: false,
        },
        orderBy: { updated_at: 'desc' },
    });
    return { queryResult };
};
const update = async (id: string, updateInfo: updateReqBody) => {
    const queryResult = await db.masterProductCategory.update({
        where: { id: id },
        data: { ...updateInfo },
        select: {
            id: true,
            title: true,
            status: false,
            created_at: false,
            updated_at: false,
        }
    }); return queryResult;
};
const getProdCategoryById = async (id: string) => {
    const queryResult = await db.masterProductCategory.findFirst({
        where: {
            AND: {
                id: id,
                status: true,
                is_deleted: false
            },
        },
        select: {
            id: true,
            title: true,
            status: true,
            updated_at: true,
        },
    });
    return queryResult
};

const prodCategoryQueries = {
    addNew,
    getTitle,
    getById,
    getAll,
    update,
    getProdCategoryById
};
export default prodCategoryQueries;
