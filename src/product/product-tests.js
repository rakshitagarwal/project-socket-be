import request from "supertest";
import { app } from "../../index.js";
import { helpers } from "./../helper/helpers.js";
import { productModel } from "./../product/product-schemas.js";
import {
  getProductByTitle,
  inActiveProductByTitle,
} from "./product-queries.js";

before(async () => {
  await productModel.deleteMany({});
});

after(async () => {
  await productModel.deleteMany({});
});

describe("Product Test /v1/products", function () {
  it("Get all product category", function () {
    return request(app)
      .get("/v1/products/category/")
      .expect(helpers.StatusCodes.OK);
  });

  it("Get product category with not Found Error", function () {
    return request(app)
      .get("/v1/products/category")
      .expect(helpers.StatusCodes.NOT_FOUND);
  });

  // it("Add Product wihtout errors", function () {
  //   return request(app)
  //     .post("/v1/products/")
  //     .set("Content-Type", "application/json")
  //     .field({
  //       title: "MacBookAirM2",
  //       description: "MAcbook AIr M2, 16gb Ram, 1TB SSD, Retina Display",
  //       purchasePrice: "150000",
  //       sellingPrice: "145000",
  //       overHeadCost: "1500",
  //       quantity: "20",
  //       ProductCategory: "507f1f77bcf86cd799439011",
  //       image: "/assets/uploads/products/Iphone14Pro.jpg",
  //     })
  //     .expect(helpers.StatusCodes.CREATED);
  // });

  // it("Add Product with validations error", function () {
  //   return request(app)
  //     .post("/v1/products/")
  //     .set("Content-Type", "multipart/form-data")
  //     .field({
  //       title: "MacBook Air M2",
  //       description: "Macbook Air M2, 16gb Ram, 1TB SSD, Retina Display",
  //       purchasePrice: "",
  //       sellingPrice: "145000",
  //       overHeadCost: "1500",
  //       quantity: "20",
  //       ProductCategory: "507f1f77bcf86cd799439011",
  //       image: "/assets/uploads/products/Iphone14Pro.jpg",
  //     })
  //     .expect(helpers.StatusCodes.NOT_FOUND);
  // });

  // it("Update Product without errros", async function () {
  //   const id = await getProductByTitle("MacBookAirM2");

  //   return request(app)
  //     .put(`/v1/products/${id}`)
  //     .set("Content-Type", "multipart/form-data")
  //     .field({
  //       title: "MacBookPro",
  //       description: "MAcbook Pro M2, 16gb Ram, 1TB SSD, Retina Display",
  //       purchasePrice: "250000",
  //       sellingPrice: "245000",
  //       overHeadCost: "5500",
  //       quantity: "20",
  //       ProductCategory: "507f1f77bcf86cd799439011",
  //       image: "/assets/uploads/products/Iphone14Pro.jpg",
  //     })
  //     .expect(helpers.StatusCodes.OK);
  // });

  // it("Update Product with validations error", async function () {
  //   const id = await getProductByTitle("MacBookPro");

  //   return request(app)
  //     .put(`/v1/products/${id}`)
  //     .set("Content-Type", "multipart/form-data")
  //     .field({
  //       title: "MacBook Pro",
  //       description: "MAcbook Pro M2, 16gb Ram, 1TB SSD, Retina Display",
  //       purchasePrice: "250000",
  //       sellingPrice: "245000",
  //       ProductCategory: "507f1f77bcf86cd799439011",
  //       image: "/assets/uploads/products/Iphone14Pro.jpg",
  //     })
  //     .expect(helpers.StatusCodes.NOT_FOUND);
  // });

  // it("Update Product with valid ObjectId", function () {
  //   return request(app)
  //     .put(`/v1/products/6322fd72bd0a54e`)
  //     .set("Content-Type", "multipart/form-data")
  //     .field({
  //       title: "MacBookPro",
  //       description: "MAcbook Pro M2, 16gb Ram, 1TB SSD, Retina Display",
  //       purchasePrice: "250000",
  //       sellingPrice: "245000",
  //       ProductCategory: "507f1f77bcf86cd799439011",
  //       image: "/assets/uploads/products/Iphone14Pro.jpg",
  //     })
  //     .expect(helpers.StatusCodes.BAD_REQUEST);
  // });

  // it("Get SIngle Product with Object ID wihtout errors", async function () {
  //   const id = await getProductByTitle("MacBookPro");
  //   return request(app)
  //     .get(`/v1/products/${id}`)
  //     .expect(helpers.StatusCodes.OK);
  // });

  // it("Get Single Product with ObjectID errors", async function () {
  //   const id = await getProductByTitle("MacBookPro");
  //   return request(app)
  //     .get(`/v1/products/6322fd72bd0a54e`)
  //     .expect(helpers.StatusCodes.BAD_REQUEST);
  // });

  // it("Get All Products wihtout error", async () => {
  //   return request(app).get("/v1/products/").expect(helpers.StatusCodes.OK);
  // });

  // it("Get All Products with pages and limit passed", function () {
  //   return request(app)
  //     .get("/v1/products/")
  //     .query({
  //       page: 2,
  //       limit: 10,
  //     })
  //     .expect(helpers.StatusCodes.NOT_FOUND);
  // });

  // it("Get All Products with invalid pages and limit passed", function () {
  //   return request(app)
  //     .get("/v1/products/")
  //     .query({
  //       page: "ajshdf",
  //       limit: "10",
  //     })
  //     .expect(helpers.StatusCodes.BAD_REQUEST);
  // });

  // it("Delete Product with Object ID errors", function () {
  //   return request(app)
  //     .delete(`/v1/products/6322fd72`)
  //     .expect(helpers.StatusCodes.BAD_REQUEST);
  // });

  // it("Delete Product without errors", async function () {
  //   const id = await getProductByTitle("MacBookPro");
  //   return request(app)
  //     .delete(`/v1/products/${id}`)
  //     .expect(helpers.StatusCodes.OK);
  // });

  // it("Get Single Product which is deleted", async function () {
  //   const id = await inActiveProductByTitle("MacBookPro");
  //   return request(app)
  //     .get(`/v1/products/${id}`)
  //     .expect(helpers.StatusCodes.NOT_FOUND);
  // });

  // it("Get All Product which is inactive", function () {
  //   return request(app)
  //     .get("/v1/products/")
  //     .expect(helpers.StatusCodes.NOT_FOUND);
  // });
});
