import { db } from '../../config/db';
import { addReqBody, IPagination, IProductMedia, updateReqBody, } from './typings/product-type';

const addNew = async (product: addReqBody) => {
    const queryResult = await db.product.create({
        data: {
            title: product.title,
            description: product.description,
            landing_image: product.landing_image,
            product_category_id: product.product_category_id,
            created_by: product.userId
        },
    }); return queryResult;
};

const getTitle = async (title: string) => {
    const queryResult = await db.product.findFirst({
        where: {
            AND: {
                title: {
                    contains: title ? title : '',
                    mode: 'insensitive'
                },
                is_deleted: false
            },
        },
        select: {
            id: true,
            status: true,
            title: true,
            description: true,
            updated_at: true,
        },
    });
    return queryResult;
};

const getById = async (id: string) => {
    const queryResult = await db.product.findFirst({
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
            description: true,
            status: true,
            updated_at: true,
        },
    });
    return queryResult
};
const getAllProduct = async (
    metaInfo: IPagination,
    where: { [key: string]: string | boolean | object }
) => {
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
        skip: parseInt(`${metaInfo.pageNum}`) * parseInt(`${metaInfo.recordLimit}`) || 0,
        take: parseInt(`${metaInfo.recordLimit}`) || 10,
    });
    return {
        queryResult,
        totalCount,
    };
};

const update = async (id: string, updateInfo: updateReqBody) => {
    const queryResult = await db.product.update({
        where: { id: id },
        data: { ...updateInfo },
        select: {
            id: true,
            title: true,
            description: true,
            status: false,
            created_at: false,
            updated_at: false,
        }
    }); return queryResult;
};

const removeAll = async function (ids: string[]) {

    const queryResult = await db.product.updateMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                is_deleted: false,
            },
        },
        data: {
            is_deleted: true,
            status: false,

        },
    });
    return queryResult;
};

const findAll = async function (ids: string[]) {
    const queryResult = await db.product.findMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                is_deleted: false,
            },
        }
    });
    return queryResult;
};

//---- Product Media Query-----------------
const findProductMediaAllId = async function (ids: string[]) {
    const queryResult = await db.media.findMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                is_deleted: false,
            },
        }
    });
    return queryResult;
};

const addProductMediaNew = async (product: IProductMedia) => {

    const addProductMediaNew = await db.productMedia.createMany({
        data: product,
    })
    return addProductMediaNew
};
const updateProductMedia = async (id: string) => {

    const queryResult = await db.productMedia.updateMany({
        where: {
            AND: {
                product_id: id,
                is_deleted: false
            }
        },
        data: { status: false, is_deleted: true }
    }); return queryResult;
};

const productQueries = {
    addNew,
    getTitle,
    getById,
    getAllProduct,
    update,
    removeAll,
    findAll,
    findProductMediaAllId,
    addProductMediaNew,
    updateProductMedia
};

export default productQueries;