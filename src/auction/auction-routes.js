import { Router } from "express";
import { validateSchema } from "./../middleware/validate.js";
import { auctionSchema } from "./../common/validationSchemas.js";
import {
  add,
  fetchAll,
  update,
  fetchCategories,
} from "./../auction/auction-handlers.js";

export const auctionRouter = Router();

auctionRouter
  .get("/category/", fetchCategories)
  .post("/", [validateSchema.body(auctionSchema)], add)
  .get("/", fetchAll)
  .put("/:id", update);
