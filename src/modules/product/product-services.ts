import fs from 'fs';
import { responseBuilder } from "../../common/responses";
import { addReqBody, Ids, IPagination, Iid, updateReqBody, IProductMedia } from "./typings/product-type";
import productQueries from "./product-queries";
import { productCategoryMessage, productMessage, MESSAGES } from "../../common/constants";
import productCategoryQueries from "../product-categories/product-category-queries";
import mediaQuery from "../media/media-queries";
import { prismaTransaction } from "../../utils/prisma-transactions";

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
        mediaQuery.findManyMedias(newReqBody.media_id)
    ]);

    if (!isExistId) {
        return responseBuilder.notFoundError(productCategoryMessage.GET.NOT_FOUND);
    }
    if (!isExistIdLandImg) {
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    if (isExistIdMedia.length !== newReqBody.media_id.length) {
        return responseBuilder.notFoundError(productMessage.GET.PRODUCT_MEDIA_IDS);
    }

    const resultTransactions = await prismaTransaction(async () => {

        newReqBody.userId = userId
        const queryResult = await productQueries.addNew(newReqBody);
        const mediaIds: IProductMedia[] = newReqBody.media_id.map((element: string) => {
            return { media_id: element, product_id: queryResult.id as string }
        });
        const productMediaQuery = await productQueries.addProductMediaNew(mediaIds);
        const promise = [queryResult, productMediaQuery]
        return promise
    })
    if (!resultTransactions) {
        return responseBuilder.badRequestError(productMessage.UPDATE.TRANSACTION_FAIL)
    }
    return responseBuilder.createdSuccess(
        productMessage.ADD.SUCCESS,
    );
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
        if (!result) {
            return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND)
        }
        return responseBuilder.okSuccess(productMessage.GET.REQUESTED, result)
    }
    const limit = parseInt(query.limit) || 10
    const page = parseInt(query.page) || 0
    const filter = []
    if (query.search) {
        filter.push({ title: { contains: query.search, mode: 'insensitive' } },)
    }
    const { queryResult, totalCount } = await productQueries.getAllProduct({ limit, filter, page });
    return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult, {
        limit,
        page,
        totalRecord: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        search: query.search || ''
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

    const [isExistProductId, isExistId, isExistIdLandImg, isExistIdMedia] = await Promise.all([
        productQueries.getById(productId.id as string), productCategoryQueries.getById(newReqBody.product_category_id),
        mediaQuery.getMediaById(newReqBody.landing_image),
        mediaQuery.findManyMedias(newReqBody.media_id)
    ]);

    if (!isExistProductId) {
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    }
    if (!isExistId) {
        return responseBuilder.notFoundError(productCategoryMessage.GET.NOT_FOUND);
    }
    if (!isExistIdLandImg) {
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    if (isExistIdMedia.length !== newReqBody.media_id.length) {
        return responseBuilder.notFoundError(productMessage.GET.PRODUCT_MEDIA_IDS);
    }

    const resultTransactions = await prismaTransaction(async () => {
        const { media_id, ...payload } = newReqBody;

        const mediaIds: IProductMedia[] = media_id.map((element: string) => {
            return { media_id: element, product_id: productId.id as string }
        });
        const getMediaId = await productQueries.findProductMediaIds(productId.id as string)
        const arrMediaId: string[] = [];
        getMediaId.map((data) => { arrMediaId.push(data.media_id) })
        const productMediaRemoveQuery = await productQueries.updateProductMedia(productId.id as string);
        const productMediaQuery = await productQueries.addProductMediaNew(mediaIds);
        const mediaFiles = await mediaQuery.findManyMedias(arrMediaId);
        mediaFiles.map((item) => fs.unlinkSync(`${item?.local_path}`));
        const deleteMedias = await mediaQuery.deleteMediaByIds(arrMediaId);
        const productUpdate = await productQueries.update(productId.id as string, payload as updateReqBody);
        const promise = [productMediaQuery, productMediaRemoveQuery, deleteMedias, productUpdate]
        return promise
    })
    if (!resultTransactions) {
        return responseBuilder.badRequestError(productMessage.UPDATE.TRANSACTION_FAIL)
    }
    return responseBuilder.okSuccess(productMessage.UPDATE.SUCCESS);
};

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
    if (!ids.length) return responseBuilder.badRequestError(productMessage.GET.NOT_FOUND);

    const resultTransactions = await prismaTransaction(async () => {
    const findProducts = await productQueries.getFindAllId(ids);
    if (!findProducts.length) return responseBuilder.notFoundError(productMessage.GET.SOME_NOT_FOUND);
    const productMedias = await productQueries.findProductMediaAll(ids);
    const productMediaIds = productMedias.map(mediaId => mediaId.id);
    const mediaIds = productMedias.map(productMedia => productMedia.media_id);
    const mediaFiles = await mediaQuery.findManyMedias(mediaIds);
    mediaFiles.map((item) => fs.unlinkSync(`${item?.local_path}`));
    const deleteMedias = await mediaQuery.deleteMediaByIds(mediaIds);
    const deleteProductMedias = await productQueries.deleteManyProductMedia(productMediaIds);
    const deleteProducts = await productQueries.deleteMultipleIds(ids);
    const promise = [deleteProducts, deleteProductMedias , deleteMedias];
    return promise;
    });
    if (!resultTransactions)  return responseBuilder.internalserverError(productMessage.DELETE.FAIL);
        return responseBuilder.okSuccess(productMessage.DELETE.SUCCESS); 
};

const productServices = {
    add,
    get,
    update,
    removeMultipleId,
};
export default productServices;
