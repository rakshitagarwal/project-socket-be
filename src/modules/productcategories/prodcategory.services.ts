import { responseBuilder } from "../../common/responses";
import { AddProdCategoryReqBody } from './typings/prodcategory.type';
import productCategoryQueries from './prodcategory.queries';

const prodCategoryServices = (() => {
    const add = async function (
        newProdCategoryReqBody: AddProdCategoryReqBody,
    ) {
        const isExist = await productCategoryQueries.getProdCategorytitle(newProdCategoryReqBody.title);
        if (!isExist) {
            const { id } = await productCategoryQueries.addNewProdCategory(newProdCategoryReqBody);
            return responseBuilder.okSuccess('add successfully', { id }
            );
        }
        return responseBuilder.badRequestError("already data");
    };
    const get = async function (id: string | undefined) {
        if (id) {
            const result = await productCategoryQueries.getProductCategoryById(id);
            return result
                ? responseBuilder.okSuccess(
                    "data successfully",
                    [result]
                )
                : responseBuilder.badRequestError(
                    "id not found"
                );
        }
        const { queryResult } = await productCategoryQueries.getAllProductCategory();
        return responseBuilder.okSuccess("get All list", queryResult, {});
    };


    return {
        add,
        get,
    };
})();
export default prodCategoryServices;
