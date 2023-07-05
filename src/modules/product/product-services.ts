import { responseBuilder } from "../../common/responses";
import { addReqBody, Ids, IPagination, IProductMedia, updateReqBody, Iid } from './typings/product-type';
import productQueries from './product-queries';
import { productCategoryMessage, productMessage, MESSAGES } from '../../common/constants';
import productCategoryQueries from '../product-categories/product-category-queries';
import mediaQuery from '../media/media-queries';
import { prismaTransaction } from "../../utils/prisma-transactions";


const add = async (newReqBody: addReqBody, userId: string) => {

    const [isExistId, isExistIdLandImg, isExistIdMedia] = await Promise.all([
        productCategoryQueries.getById(newReqBody.product_category_id),
        mediaQuery.getMediaById(newReqBody.landing_image),
        productQueries.findProductMediaAllId(newReqBody.media_id)
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
        const productId: string = queryResult.id
        const arrId: IProductMedia = [];
        newReqBody.media_id.forEach((element) => {
            arrId.push({ media_id: element, product_id: productId })
        });
        const productMediaQuery = await productQueries.addProductMediaNew(arrId);
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

const update = async (newReqBody: addReqBody) => {

    const [isExistProductId, isExistId, isExistIdLandImg, isExistIdMedia] = await Promise.all([
        productQueries.getById(newReqBody.id), productCategoryQueries.getById(newReqBody.product_category_id),
        mediaQuery.getMediaById(newReqBody.landing_image),
        productQueries.findProductMediaAllId(newReqBody.media_id)
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

    let productUpdate;
    const resultTransactions = await prismaTransaction(async () => {
        const { id, media_id, ...payload } = newReqBody;

        const arrId: IProductMedia = [];
        media_id.forEach((element) => {
            arrId.push({ media_id: element, product_id: id })
        });

        const productMediaRemoveQuery = await productQueries.updateProductMedia(id);
        const mediaData = await mediaQuery.deleteMediaByIds(media_id)
        const productMediaQuery = await productQueries.addProductMediaNew(arrId);
        productUpdate = await productQueries.update(id as string, payload as updateReqBody);
        const promise = [productMediaQuery, productMediaRemoveQuery, mediaData, productUpdate]
        return promise
    })
    if (!resultTransactions) {
        return responseBuilder.badRequestError(productMessage.UPDATE.TRANSACTION_FAIL)
    }
    return responseBuilder.okSuccess(
        productMessage.UPDATE.SUCCESS,
        productUpdate
    );
};

const removeAll = async (collectionId: Ids) => {

    const existMultipleId = await productQueries.findAll(collectionId.ids);
    if (existMultipleId.length < 0) {
        return responseBuilder.notFoundError(productMessage.GET.NOT_FOUND);
    }
    await productQueries.removeAll(collectionId.ids);
    return responseBuilder.createdSuccess(productMessage.DELETE.SUCCESS);
};

const productServices = {
    add,
    get,
    update,
    removeAll
};
export default productServices;
