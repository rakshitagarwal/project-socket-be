import { responseBuilder, sanitize } from "../../common/responses";
import { addReqBody, updateReqBody } from './typings/product-category-type';
import productCategoryQueries from './product-category-queries';
import { productCategoryMessage } from '../../common/constants';


const add = async (newReqBody: addReqBody) => {

    newReqBody.title = sanitize(newReqBody.title)
    const isExist = await productCategoryQueries.getTitle(newReqBody.title);
    if (!isExist) {
        const { id } = await productCategoryQueries.addNew(newReqBody);
        return responseBuilder.okSuccess(productCategoryMessage.ADD.SUCCESS, { id }
        );
    }
    return responseBuilder.badRequestError(productCategoryMessage.ADD.ALREADY_EXIST);
};

const get = async (id: string | undefined, moduleInfo: { title: string }) => {
    if (id) {
        const result = await productCategoryQueries.getById(id);
        return result
            ? responseBuilder.okSuccess(
                productCategoryMessage.GET.REQUESTED,
                [result]
            )
            : responseBuilder.badRequestError(
                productCategoryMessage.GET.NOT_FOUND
            );
    }
    const { queryResult } = await productCategoryQueries.getAll(moduleInfo.title as string);
    return responseBuilder.okSuccess(productCategoryMessage.GET.ALL, queryResult, {});
};

const update = async (newReqBody: addReqBody) => {
    // check if product category is exist
    const isExistId = await productCategoryQueries.getById(newReqBody.id);
    const isExist = await productCategoryQueries.getTitle(newReqBody.title);
    if (!isExistId || isExist) {
        return responseBuilder.badRequestError(
            !isExistId ? productCategoryMessage.GET.NOT_FOUND
                : productCategoryMessage.ADD.ALREADY_EXIST);
    }

    const { id, ...payload } = newReqBody;
    const data = await productCategoryQueries.update(id as string, payload as updateReqBody);
    return responseBuilder.okSuccess(productCategoryMessage.UPDATE.SUCCESS, [data]
    );
};
const prodCategoryServices = {
    add,
    get,
    update
};
export default prodCategoryServices;
