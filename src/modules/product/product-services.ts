import { responseBuilder } from "../../common/responses";
import { addReqBody, Ids, IPagination, updateReqBody } from './typings/product-type';
import productQueries from './product-queries';
import { productCategoryMessage, productMessage, MESSAGES } from '../../common/constants';
import productCategoryQueries from '../product-categories/product-category-queries';
import mediaQuery from '../media/media-queries';


const add = async (newReqBody: addReqBody, userId: string) => {

    const isExistId = await productCategoryQueries.getById(newReqBody.product_category_id);
    if (!isExistId) {
        return responseBuilder.badRequestError(productCategoryMessage.GET.NOT_FOUND);
    }
    const isExistIdMedia = await mediaQuery.getMediaById(newReqBody.landing_image);
    if (!isExistIdMedia) {
        return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    newReqBody.userId = userId
    const { id } = await productQueries.addNew(newReqBody);
    return responseBuilder.okSuccess(productMessage.ADD.SUCCESS, { id }
    );
};

const get = async (id: string | undefined,
    moduleInfo: { title: string }, metaInfo: IPagination) => {

    if (id) {
        const result = await productQueries.getById(id);
        return result
            ? responseBuilder.okSuccess(
                productMessage.GET.REQUESTED,
                result
            )
            : responseBuilder.badRequestError(
                productMessage.GET.NOT_FOUND
            );
    }
    const { queryResult, totalCount } = await productQueries.getAllProduct(
        metaInfo,
        moduleInfo
    );
    return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult,
        {
            limit: metaInfo.recordLimit,
            currentPage: metaInfo.pageNum,
            totalRecords: totalCount,
            totalPages: Math.ceil(totalCount / metaInfo.recordLimit),
        });
};

const update = async (newReqBody: addReqBody) => {
    // check if product category is exist
    const isExistId = await productQueries.getById(newReqBody.id);

    if (!isExistId) {
        return responseBuilder.badRequestError(productMessage.GET.NOT_FOUND);
    }

    const { id, ...payload } = newReqBody;
    const data = await productQueries.update(id as string, payload as updateReqBody);
    return responseBuilder.okSuccess(productMessage.UPDATE.SUCCESS, [data]
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
