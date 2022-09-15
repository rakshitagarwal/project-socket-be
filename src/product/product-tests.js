import request from "supertest";
import { app } from "../../index.js";
import { helpers } from "./../helper/helpers.js";

describe("Product Test /v1/products", function () {
  it("Add Product wihtout errors", function () {
    return request(app)
      .post("/v1/products/")
      .set("Content-Type", "multipart/form-data")
      .field({
        title: "MacBook Air M2",
        description: "MAcbook AIr M2, 16gb Ram, 1TB SSD, Retina Display",
        purchasePrice: "150000",
        sellingPrice: "145000",
        overHeadCost: "1500",
        quantity: "20",
        ProductCategory: "507f1f77bcf86cd799439011",
      })
      .attach("image", "/home/globalvox/Downloads/Iphone14Pro.jpg")
      .expect(helpers.StatusCodes.CREATED);
  });

  it("Add Product with validations error", function () {
    return request(app)
      .post("/v1/products/")
      .set("Content-Type", "multipart/form-data")
      .field({
        title: "MacBook Air M2",
        description: "Macbook Air M2, 16gb Ram, 1TB SSD, Retina Display",
        purchasePrice: "",
        sellingPrice: "145000",
        overHeadCost: "1500",
        quantity: "20",
        ProductCategory: "507f1f77bcf86cd799439011",
      })
      .attach("image", "/home/globalvox/Downloads/Iphone14Pro.jpg")
      .expect(helpers.StatusCodes.NOT_FOUND);
  });

  it("Add Product with no field upload", function () {
    return request(app).post("/v1/products").set();
  });
});
