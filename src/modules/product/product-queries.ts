import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import {
    addReqBody,
    IPaginationQuery,
    IProductMedia,
    updateReqBody,
} from "./typings/product-type";

/**
 * @param {addReqBody} product  - product data
 * @description - data for the product
 */
const addNew = async (prisma: PrismaClient, product: addReqBody) => {
    const queryResult = await prisma.products.create({
        data: {
            title: product.title,
            description: product.description,
            landing_image: product.landing_image,
            price: product.price,
            product_category_id: product.product_category_id,
            created_by: product.userId,
        },
    });
    return queryResult;
};

/**
 * @param {string} title  - pass title data
 * @description -  get title is check title or not on product
 */
const getTitle = async (title: string) => {
    const queryResult = await db.product.findFirst({
        where: {
            AND: {
                title: {
                    contains: title ? title : "",
                    mode: "insensitive",
                },
                is_deleted: false,
            },
        },
        select: {
            id: true,
            status: true,
            title: true,
            description: true,
            price: true,
            updated_at: false,
        },
    });
    return queryResult;
};

/**
 * @param {string} id  - pass id product
 * @description -  get id is check title or not on product
 */
const getById = async (id: string) => {
    const queryResult = await db.product.findFirst({
        where: {
            AND: {
                id: id,
                status: true,
                is_deleted: false,
            },
        },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            medias: {
                select: {
                    id: true,
                    type: true,
                    size: true,
                    filename: true,
                    local_path: true,
                    mime_type: true,
                    status: true,
                    updated_at: false,
                },
            },
            updated_at: false,
            productCategories: {
                select: {
                    id: true,
                    title: true,
                },
            },
            // auctions: {
            //     include: {
            //         _count: true,
            //     },
            // },
            productMedias: {
                select: {
                    medias: {
                        select: {
                            id: true,
                            type: true,
                            size: true,
                            filename: true,
                            local_path: true,
                            mime_type: true,
                            status: true,
                            updated_at: false,
                        },
                    },
                },
            },
        },
    });
    return queryResult;
};

/**
 * @param {IPaginationQuery} query   Pagination in  product
 * @description -  get all product on product and total Count
 */
const getAllProduct = async (query: IPaginationQuery) => {   
    let orderBy = {} 
    if (query._sort === "category") {
        orderBy =  {
            productCategories: { title: query._order },
        };
    } else if (query._sort) {
        orderBy =  { [`${query._sort}`]: query._order };
    }
    const totalCount = await db.product.count({
        where: {
            AND: [
                { is_deleted: false },
                {
                    AND: query.filter,
                },
            ],
        },
    });

    const queryResult = await db.product.findMany({
        where: {
            AND: [
                { is_deleted: false },
                {
                    OR: query.filter,
                },
            ],
        },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            medias: {
                select: {
                    id: true,
                    type: true,
                    size: true,
                    filename: true,
                    local_path: true,
                    mime_type: true,
                    status: true,
                    updated_at: false,
                },
            },
            // auctions: {
            //     include: {
            //         _count: true,
            //     },
            // },
            updated_at: false,
            productCategories: {
                select: {
                    id: true,
                    title: true,
                },
            },
            productMedias: {
                select: {
                    medias: {
                        select: {
                            id: true,
                            type: true,
                            size: true,
                            filename: true,
                            local_path: true,
                            mime_type: true,
                            status: true,
                            updated_at: false,
                        },
                    },
                },
            },
        },
        orderBy: orderBy,
        skip: query.limit * query.page,
        take: query.limit,
    });
    return {
        queryResult,
        totalCount,
    };
};

/**
 * @param {string} id in  product
 * @param {updateReqBody} updateInfo pass in payload in product
 * @description - update query
 */
const update = async (
    prisma: PrismaClient,
    id: string,
    updateInfo: updateReqBody
) => {
    const queryResult = await prisma.products.update({
        where: { id: id },
        data: { ...updateInfo },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            landing_image: true,
            status: false,
            productMedias: {
                select: {
                    medias: {
                        select: {
                            id: true,
                            type: true,
                            size: true,
                            filename: true,
                            local_path: true,
                            mime_type: true,
                            status: true,
                            updated_at: false,
                        },
                    },
                },
            },
            created_at: false,
            updated_at: false,
        },
    });
    return queryResult;
};

/**
 * @param {string} ids in  product
 * @description - delete multiple ids on product
 */
const deleteMultipleIds = async function (ids: string[]) {
    const queryResult = await db.product.deleteMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                is_deleted: false,
            },
        },
    });
    return queryResult;
};

/**
 * @param {string} ids in product
 * @description - get FindAll Id multiple ids on product
 */
const getFindAllId = async function (ids: string[]) {
    const queryResult = await db.product.findMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                is_deleted: false,
            },
        },
        select: {
            auctions: {
                include: {
                    _count: true,
                },
            },
        },
        orderBy:{
            updated_at:"desc"
        }
    });
    return queryResult;
};

//---- Product Media Query-----------------

/**
 * @param {string} id in product media
 * @description - get Find ProductMedia All id on product
 */
const findProductMediaIds = async function (id: string) {
    const queryResult = await db.productMedia.findMany({
        where: {
            AND: {
                product_id: id,
                is_deleted: false,
            },
        },
        select: {
            media_id: true,
        },
    });
    return queryResult;
};

/**
 * @param {string} ids in product media
 * @description - get Find ProductMedia All id on product
 */
const findProductMediaAll = async function (ids: string[]) {
    const queryResult = await db.productMedia.findMany({
        where: {
            AND: {
                product_id: {
                    in: ids,
                },
                is_deleted: false,
            },
        },
        orderBy:{
            updated_at:"desc"
        }
    });
    return queryResult;
};

/**
 * @param {string[]} ids in product media
 * @description - delete ProductMedia All ids on product
 */
const deleteManyProductMedia = async function (ids: string[]) {
    const queryResult = await db.productMedia.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return queryResult;
};

/**
 * @param {IProductMedia} product in product media
 * @description - add ProductMedia All ids on product
 */
const addProductMediaNew = async (
    prisma: PrismaClient,
    product: IProductMedia[]
) => {
    const addProductMediaNew = await prisma.productMedia.createMany({
        data: product,
    });
    return addProductMediaNew;
};

/**
 * @param {string} id in product media
 * @description -  ProductMedia All ids on product
 */
const updateProductMedia = async (id: string[]) => {
    const queryResult = await db.productMedia.deleteMany({
        where: {
            AND: {
                product_id: {
                    in: id,
                },
                is_deleted: false,
            },
        },
    });
    return queryResult;
};

const productQueries = {
    addNew,
    getTitle,
    getById,
    getAllProduct,
    update,
    deleteMultipleIds,
    getFindAllId,
    findProductMediaAll,
    addProductMediaNew,
    updateProductMedia,
    deleteManyProductMedia,
    findProductMediaIds,
};

export default productQueries;
