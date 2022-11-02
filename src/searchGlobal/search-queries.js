import { UserModel } from "../user/user-schemas.js";
import {
  getAllUserRole,
  roleSchemaFind,
} from "../user/user-queries.js";
import { productModel } from "../product/product-schemas.js";
export const searchCount = async () => {
  const count = await UserModel.find({ status: false });
  return count.length;
};

const filterDataModule = async (collectionData, searchText, arr) => {
  let searchType = isNaN(searchText) ? searchText : Number(searchText);
  const filterData = collectionData.filter((data) => {
    let isValid;
    for (let datas of arr) {
      isValid = isValid || data[datas] === searchType;
    }
    return isValid;
  });
  return filterData;
};
export const search = async (pages, limit, searchText, moduleName) => {
  let collectionData, arr, allCountData;
  if (searchText === "") {
    const roleUser = await roleSchemaFind();
    const searchData = await getAllUserRole(pages, limit, roleUser._id);
    return searchData;
  }
  if (moduleName === "User") {
    const roleUser = await roleSchemaFind();
    collectionData = await UserModel.find({
      status: false,
      Role: roleUser._id,
    })
      .populate("Role", { name: 1 })
      .limit(limit)
      .skip(limit * pages)
      .lean();
    allCountData = await UserModel.find({
      status: false,
      Role: roleUser._id,
    });
    const userInfo = [];
    collectionData.forEach((element) => {
      delete element.passcode;
      delete element.password;
      delete element.createdAt;
      delete element.updatedAt;
      userInfo.push(element);
    });
    arr = ["firstname", "lastname", "country", "gender", "zip"];
  } else if (moduleName === "Product") {
    collectionData = await productModel
      .find({ IsDeleted: true })
      .limit(limit)
      .skip(limit * pages)
      .populate("ProductCategory", false, { name: searchText })
      .lean();
    allCountData = await productModel
      .find({ IsDeleted: true })
      .countDocuments();
    arr = ["title", "name", "sellingPrice", "quantity"];
  }
  const searchData = await filterDataModule(collectionData, searchText, arr);
  const dataCount = await filterDataModule(allCountData, searchText, arr);
  return {
    searchData: searchData,
    count: dataCount.length,
    pages: Math.ceil(dataCount.length / limit),
    currentPage: pages,
    limit,
  };
};
