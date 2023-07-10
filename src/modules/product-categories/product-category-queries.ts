import { db } from '../../config/db';
import { addReqBody, updateReqBody } from './typings/product-category-type';


/**
 * @param {addReqBody} prodCategory  - product category data
 * @description - data for the product category
 */
const addNew = async (prodCategory: addReqBody) => {
    const queryResult = await db.masterProductCategory.create({
        data: {
            title: prodCategory.title
        },
    }); return queryResult;
};

/**
 * @param {string} title  - it is exist or not for title in product category data
 * @description - get for title in the product category
 */
const getTitle = async (title: string) => {
    const queryResult = await db.masterProductCategory.findFirst({
        where: {
            AND: {
                title: title,
                is_deleted: false
            },
        },
        select: {
            id: true,
            status: false,
            updated_at: false,
        },
    });
    return queryResult;
};

/**
 * @param {string} id  - get id in product category data
 * @description - get id for the product category
 */
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
            status: false,
            updated_at: false,
        },
    });
    return queryResult
};

/**
 * @param {string} title  - title for search and it is optional in product category data
 * @description - get All api for the product category
 */
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
            status: false,
            created_at: false,
            updated_at: false,
        },
        orderBy: { updated_at: 'desc' },
    });
    return { queryResult };
};

/**
 * @param {updateReqBody} updateInfo  - product category data
 * @param {string} id  -  product category get Id 
 * @description - update for the product category
 */
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

/**
 * @param {string} id  -  product category get Id 
 * @description - getId in the product category
 */
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
            status: false,
            updated_at: false,
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
