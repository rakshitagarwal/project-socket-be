import { db } from '../../config/db';
import { addReqBody, IPaginationQuery, IProductMedia, updateReqBody, } from './typings/product-type';

const addNew = async (product: addReqBody) => {
    const queryResult = await db.product.create({
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
                    updated_at: true,
                }
            },
            updated_at: true,
            productCategories: {
                select: {
                    id: true,
                    title: true
                }
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
                            updated_at: true,
                        }
                    }
                }
            }
        },
    });
    return queryResult;
};
const getAllProduct = async (query: IPaginationQuery) => {
    const totalCount = await db.product.count({
        where: {
            AND: [
                { is_deleted: false },
                {
                    OR: query.filter
                }
            ],
        },
    });

    const queryResult = await db.product.findMany({
        where: {
            AND: [
                { is_deleted: false },
                {
                    OR: query.filter
                }
            ],
        },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            medias: {
                select: {
                    id: true,
                    type: true,
                    size: true,
                    filename: true,
                    local_path: true,
                    mime_type: true,
                    status: true,
                    updated_at: true,
                }
            },
            status: true,
            updated_at: false,
            productCategories: {
                select: {
                    id: true,
                    title: true
                }
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
                            updated_at: true,
                        }
                    }
                }
            }
        },
        orderBy: { updated_at: 'desc' },
        skip: query.limit * query.page,
        take: query.limit
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
                            updated_at: true,
                        }
                    }
                }
            },
            created_at: false,
            updated_at: false,
        },
    });
    return queryResult;
};

const removeAll = async function (ids: string[]) {
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
        },
    });
    return queryResult;
};
const findProductMediaAllIds = async function (id: string) {
    const queryResult = await db.productMedia.findMany({
        where: {
            AND: {
                product_id: id,
                is_deleted: false,
            },
        },
        select: {
            media_id: true
        }
    });
    return queryResult;
};

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
    });
    return queryResult;
};

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

const addProductMediaNew = async (product: IProductMedia[]) => {
    const addProductMediaNew = await db.productMedia.createMany({
        data: product,
    });
    return addProductMediaNew;
};
const updateProductMedia = async (id: string) => {
    const queryResult = await db.productMedia.deleteMany({
        where: {
            AND: {
                product_id: id,
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
    removeAll,
    getFindAllId,
    findProductMediaAllId,
    findProductMediaAll,
    addProductMediaNew,
    updateProductMedia,
    deleteManyProductMedia,
    findProductMediaAllIds
};

export default productQueries;
