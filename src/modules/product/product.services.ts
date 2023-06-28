import { responseBuilder } from "../../common/responses";
import { addReqBody, IPagination, Product } from './typings/product.type';
import productQueries from './product.queries';
import { productCategoryMessage, productMessage } from '../../common/constants';
import productCategoryQueries from '../product-categories/product-category.queries';

const productServices = (() => {

    const add = async function (newReqBody: addReqBody, userId: string) {

        const isExistId = await productCategoryQueries.getById(newReqBody.product_category_id);
        if (!isExistId) {
            return responseBuilder.badRequestError(productCategoryMessage.GET.NOT_FOUND);
        }
        newReqBody.userId = userId
        const { id } = await productQueries.addNew(newReqBody);
        return responseBuilder.okSuccess(productMessage.ADD.SUCCESS, { id }
        );
    };

    const get = async function (id: string | undefined,
        moduleInfo: { title: string }, metainfo: IPagination) {

        if (id) {
            const result = await productQueries.getById(id);
            return result
                ? responseBuilder.okSuccess(
                    productMessage.GET.REQUESTED,
                    [result]
                )
                : responseBuilder.badRequestError(
                    productMessage.GET.NOT_FOUND
                );
        }
        const { queryResult, totalCount } = await productQueries.getAllProduct(
            metainfo,
            moduleInfo
        );
        return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult,
            {
                limit: metainfo.recordLimit,
                currentPage: metainfo.pageNum,
                totalRecords: totalCount,
                totalPages: Math.ceil(totalCount / metainfo.recordLimit),
            });
    };

    const update = async function (
        newReqBody: addReqBody,
    ) {
        // check if product category is exist
        const isExistId = await productQueries.getById(newReqBody.id);
        const isExist = await productQueries.getTitle(newReqBody.title);
        if (!isExistId || isExist) {
            return responseBuilder.badRequestError(
                !isExistId ? productMessage.GET.NOT_FOUND
                    : productMessage.ADD.ALREADY_EXIST);
        }
        const newUpdateProduct = new Product().setUpdate({
            ...newReqBody,
            id: newReqBody.id,
        });
        const data = await productQueries.update(newUpdateProduct);
        return responseBuilder.okSuccess(productMessage.UPDATE.SUCCESS, [data]
        );
    };

    return {
        add,
        get,
        update
    };
})();
export default productServices;
