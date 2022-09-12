import request from "supertest";
import { app } from "../../index.js";

describe("Product Test /v1/products", function () {
  it("Add Product", function () {
    return request(app).post("/v1/product").send({}).expect(201);
  });
});
