import { responseBuilder, sanitize } from "../../common/responses";
import { addReqBody, Product } from './typings/product.type';
import productQueries from './product.queries';
import { productMessage } from '../../common/constants';

const productServices = (() => {

    const add = async function (newReqBody: addReqBody) {
        

        const { id } = await productQueries.addNew(newReqBody);
        return responseBuilder.okSuccess(productMessage.ADD.SUCCESS, { id }
        );

        return responseBuilder.badRequestError(productMessage.ADD.ALREADY_EXIST);
    };

    const get = async function (id: string | undefined) {
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
        const { queryResult } = await productQueries.getAll();
        return responseBuilder.okSuccess(productMessage.GET.ALL, queryResult, {});
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
        const newUpdateProduct = new Product().setUpdate(
            {
                ...newReqBody,
                id: newReqBody.id,
            },
            // metaInfo.userInfo?.ids as string
        );
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
