import { responseBuilder, sanitize } from "../../common/responses";
import { IParamQuery, Ids, addReqBody, updateReqBody } from './typings/product-category-type';
import productCategoryQueries from './product-category-queries';
import { productCategoryMessage } from '../../common/constants';

/**
 * @description add for product category
 * @see sanitize sanitize is generic function. 
 * @see getTitle It is unique title field   
 * @returns {object} - the response object using responseBuilder.
 */
const add = async (newReqBody: addReqBody) => {
    newReqBody.title = sanitize(newReqBody.title)
    const isExist = await productCategoryQueries.getTitle(newReqBody.title);
    if (isExist) {
        return responseBuilder.conflictError(productCategoryMessage.ADD.ALREADY_EXIST);
    }
    const { id } = await productCategoryQueries.addNew(newReqBody);
    return responseBuilder.createdSuccess(productCategoryMessage.ADD.SUCCESS, { id }
    );
};

/**
 * @description  it is used in get id ,getAll and search title field apis for product category
 * @returns {object}  - the response object using responseBuilder.
 */
const get = async (id: string | undefined, dataInfo: { title: string }) => {
    if (id) {
        const result = await productCategoryQueries.getById(id);
        return result
            ? responseBuilder.okSuccess(
                productCategoryMessage.GET.REQUESTED,
                result
            )
            : responseBuilder.badRequestError(
                productCategoryMessage.GET.NOT_FOUND
            );
    }
    const { queryResult } = await productCategoryQueries.getAll(dataInfo.title as string);
    return responseBuilder.okSuccess(productCategoryMessage.GET.ALL, queryResult, {});
};

/**
 * @description  it is used in get id ,getAll and search title field apis for product category
 * @see getTitle It is unique title field   
 * @see getById in pass the product Category Id.
 * @see sanitize sanitize is generic function. 
 * @returns {object}  - the response object using responseBuilder.
 */
const update = async (productCategoryId: IParamQuery, payload: addReqBody) => {
    payload.title = sanitize(payload.title)

    const isExistId = await productCategoryQueries.getById(productCategoryId.id as string);
    if (!isExistId) {
        return responseBuilder.badRequestError(productCategoryMessage.GET.NOT_FOUND);
    }
    const isExistTitle = await productCategoryQueries.getTitle(payload.title);
    if (isExistTitle) {
        return responseBuilder.conflictError(productCategoryMessage.ADD.ALREADY_EXIST);
    }
    const data = await productCategoryQueries.update(productCategoryId.id as string, payload as updateReqBody);
    return responseBuilder.okSuccess(productCategoryMessage.UPDATE.SUCCESS, data
    );
};


const removeMultipleId = async (collectionId: Ids) => {
    const ids = collectionId.ids;
    console.log("*****", ids.length);


    const existIds = await productCategoryQueries.getProductCategoryAll(ids)

    if (!existIds.length) {
        return responseBuilder.badRequestError(productCategoryMessage.GET.NOT_FOUND);
    }
    const updateMultipleId = await productCategoryQueries.deleteMultipleIds(ids);
    if (updateMultipleId.count !== ids.length) {
        return responseBuilder.badRequestError();
    }
    return responseBuilder.okSuccess(productCategoryMessage.DELETE.SUCCESS, updateMultipleId);

};

const prodCategoryServices = {
    add,
    get,
    update,
    removeMultipleId
};
export default prodCategoryServices;
