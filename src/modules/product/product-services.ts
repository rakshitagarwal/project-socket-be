import fs from "fs";
import { responseBuilder } from "../../common/responses";
import {
    addReqBody,
    Ids,
    IPagination,
    Iid,
    updateReqBody,
} from "./typings/product-type";
import productQueries from "./product-queries";
import {
    productCategoryMessage,
    productMessage,
    MESSAGES,
    NODE_EVENT_SERVICE,
} from "../../common/constants";
import productCategoryQueries from "../product-categories/product-category-queries";
import mediaQuery from "../media/media-queries";
import { prismaTransaction } from "../../utils/prisma-transactions";
import { PrismaClient } from "@prisma/client";
import eventService from "../../utils/event-service";
import { auctionQueries } from "../auction/auction-queries";

/**
 * @description  add product
 * @param {string} userId it user ids.
 * @param {addReqBody} newReqBody pass payload
 * @see getById in pass the product Category Id.
 * @see getMediaById in pass the product media Id.
 * @see findManyMedias  check Ids in pass the product media Id.
 * @returns {object}  - the response object using responseBuilder.
 */
const add = async (newReqBody: addReqBody, userId: string) => {
    const [isExistId, isExistIdLandImg, isExistIdMedia] = await Promise.all([
        productCategoryQueries.getById(newReqBody.product_category_id),
        mediaQuery.getMediaById(newReqBody.landing_image),
        mediaQuery.findManyMedias(newReqBody.media_id),
    ]);

    if (!isExistId) {
        return responseBuilder.notFoundError(
            productCategoryMessage.GET.NOT_FOUND
        );
    }
    if (!isExistIdLandImg) {
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    if (isExistIdMedia.length !== newReqBody.media_id.length) {
        return responseBuilder.notFoundError(
            productMessage.GET.PRODUCT_MEDIA_IDS
        );
    }
    newReqBody.userId = userId;
    const resultTransactions = await prismaTransaction(
        async (prisma: PrismaClient) => {
            const queryResult = await productQueries.addNew(prisma, newReqBody);
            const mediaIds = newReqBody.media_id.map((element) => {
                return {
                    media_id: element,
                    product_id: queryResult.id as string,
                };
            });
            const productMediaQuery = await productQueries.addProductMediaNew(
                prisma,
                mediaIds
            );
            return [queryResult, productMediaQuery];
        }
    );
    if (!resultTransactions.length) {
        return responseBuilder.badRequestError(
            productMessage.UPDATE.TRANSACTION_FAIL
        );
    }
    return responseBuilder.createdSuccess(productMessage.ADD.SUCCESS);
};

/**
 * @description   it is used in get id ,getAll and search title field apis for product
 * @param {id} ids it user ids.
 * @param {IPagination} query pagination for pass payload
 * @returns {object}  - the response object using responseBuilder.
 */
const get = async ({ id }: Iid, query: IPagination) => {
    if (id) {
        const result = await productQueries.getById(id);        
        if (!result) 
            return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
        
        return responseBuilder.okSuccess(productMessage.GET.REQUESTED, result);
    }
    const limit = parseInt(query.limit) || 20;
    const page = parseInt(query.page) || 0;
    const _sort = query._sort || "category";
    const _order = query._order || "asc";
    const filter = [];
    if (query.search) {
        filter.push({ title: { contains: query.search, mode: "insensitive" } });
    }
    const { queryResult, totalCount } = await productQueries.getAllProduct({
        limit,
        filter,
        page,
        _sort,
        _order,
    });
    return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult, {
        limit,
        page,
        totalRecord: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        search: query.search || "",
        sort: query._sort,
        order: query._order,
    });
};

/**
 * @description   it is used in geting all active products with search title field.
 * @param {IPagination} query pagination for pass payload
 * @returns {object}  - the response object using responseBuilder.
 */
const getAuctionProducts = async (query: IPagination) => {
    const limit = parseInt(query.limit) || 20;
    const page = parseInt(query.page) || 0;
    const filter = [];
    if (query.search)
        filter.push({ title: { contains: query.search, mode: "insensitive" } });

    const  { queryResult, totalCount }  = await productQueries.getAllActiveProducts({ limit, filter, page });
    return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult, {
        limit,
        page,
        totalRecord: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        search: query.search || "",
    });
};

/**
 * @description update product
 * @see getById in pass the product Category Id.
 * @see getMediaById in pass the product media Id.
 * @see findManyMedias  check Ids in pass the product media Id.
 * @see findManyMedias  check Ids in pass the product media Id.
 * @see updateProductMedia In check the product media id
 * @see addProductMediaNew product add
 * @see deleteMediaByIds In check the media id
 * @param {Ids} productId pass in product id
 * @param {addReqBody} addReqBody pass the payload
 * @returns {object}  - the response object using responseBuilder.
 */
const update = async (productId: Iid, newReqBody: addReqBody) => {
    const [isExistProductId, isExistId, isExistIdLandImg, isExistIdMedia, isExistAuctions] =
        await Promise.all([
            productQueries.getById(productId.id as string),
            productCategoryQueries.getById(newReqBody.product_category_id),
            mediaQuery.getMediaById(newReqBody.landing_image),
            mediaQuery.findManyMedias(newReqBody.media_id),
            auctionQueries.productAuctionList(productId?.id as string)
        ]);
    if(isExistAuctions){
        return responseBuilder.badRequestError(productMessage.UPDATE.IN_AUCTIONS);
    }
    if (!isExistProductId) {
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    }
    if (!isExistId) {
        return responseBuilder.notFoundError(
            productCategoryMessage.GET.NOT_FOUND
        );
    }
    if (!isExistIdLandImg) {
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    if (isExistIdMedia.length !== newReqBody.media_id.length) {
        return responseBuilder.notFoundError(
            productMessage.GET.PRODUCT_MEDIA_IDS
        );
    }

    // EVENT FOR DELETING THE OLD IMAGES FROM FS
    eventService.emit(
        NODE_EVENT_SERVICE.DELETE_PRODUCT_MEDIA_IMAGES,
        isExistProductId.id
    );

    const { media_id, ...payload } = newReqBody;
    const mediaIds = media_id.map((element) => {
        return { media_id: element, product_id: productId.id as string };
    });

    const createTrx = await prismaTransaction(async (prisma: PrismaClient) => {
        const productUpdate = await productQueries.update(
            prisma,
            productId.id as string,
            payload as updateReqBody
        );
        const productMediaQuery = await productQueries.addProductMediaNew(
            prisma,
            mediaIds
        );
        return { productUpdate, productMediaQuery };
    });

    if (!createTrx) {
        return responseBuilder.badRequestError(
            productMessage.UPDATE.TRANSACTION_FAIL
        );
    }
    return responseBuilder.okSuccess(productMessage.UPDATE.SUCCESS);
};

/**
 * @description update status of one product
 * @param {Ids} productId id is passed in productId
 * @param {boolean} status boolean value to change status of a product
 * @returns {object}  - the response object using responseBuilder.
 */
const updateStatus = async (productId: Iid, status: boolean) => {
    const isExistProductId = await productQueries.getById(productId.id as string);    
    if (!isExistProductId) return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    
    const result = await productQueries.updateStatus(productId.id as string, status);
    if (!result) return responseBuilder.expectationFaild(productMessage.UPDATE.STATUS_NOT_CHANGED);
    
    return responseBuilder.okSuccess(productMessage.UPDATE.STATUS_CHANGED);
}

/**
 * @description delete product by ids
 * @see getFindAllId  product Ids.
 * @see findProductMediaAll product media ids.
 * @see findManyMedias media ids.
 * @see deleteMediaByIds delete media entries by ids.
 * @see deleteManyProductMedia delete product media entries by ids.
 * @see deleteMultipleIds delete product entries by ids.
 * @param {Ids} collectionId pass in product id
 * @returns {object}  - the response object using responseBuilder.
 */
const removeMultipleId = async (collectionId: Ids) => {
    const ids = collectionId.ids;
    if (!ids.length)
        return responseBuilder.badRequestError(productMessage.GET.NOT_FOUND);
    const findProducts = await productQueries.getFindAllId(ids);
    if (!findProducts.length)
        return responseBuilder.notFoundError(productMessage.GET.SOME_NOT_FOUND);
    const productMedias = await productQueries.findProductMediaAll(ids);
    if (!productMedias.length)
        return responseBuilder.notFoundError(productMessage.GET.SOME_NOT_FOUND);

    const isAuctionExists = findProducts.some((product) => {
        if (product.auctions.length > 0) return true;
        return false;
    });

    if (isAuctionExists) {
        return responseBuilder.badRequestError(
            productMessage.ADD.PRODUCT_ADDED_WITH_AUCTION
        );
    }

    const productMediaIds = productMedias.map((mediaId) => mediaId.id);
    const mediaIds = productMedias.map((productMedia) => productMedia.media_id);
    const mediaFiles = await mediaQuery.findManyMedias(mediaIds);
    if (!mediaFiles.length)
        return responseBuilder.notFoundError(productMessage.GET.SOME_NOT_FOUND);
    mediaFiles.map((item) => fs.unlinkSync(`${item?.local_path}`));

    const resultTransactions = await prismaTransaction(async () => {
        const [deleteMedias, deleteProducts, deleteProductMedias] =
            await Promise.all([
                mediaQuery.deleteMediaByIds(mediaIds),
                productQueries.deleteMultipleIds(ids),
                productQueries.deleteManyProductMedia(productMediaIds),
            ]);
        const promise = [deleteMedias, deleteProducts, deleteProductMedias];
        return promise;
    });
    if (!resultTransactions)
        return responseBuilder.internalserverError(productMessage.DELETE.FAIL);
    return responseBuilder.okSuccess(productMessage.DELETE.SUCCESS);
};

const productServices = {
    add,
    get,
    getAuctionProducts,
    update,
    updateStatus,
    removeMultipleId,
};
export default productServices;
