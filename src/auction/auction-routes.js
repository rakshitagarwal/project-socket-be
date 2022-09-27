import { Router } from "express";
import { validateSchema } from "./../middleware/validate.js";
import { auctionSchema, idSchema } from "./../common/validationSchemas.js";
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
  .put(
    "/:id",
    [validateSchema.params(idSchema), validateSchema.body(auctionSchema)],
    update
  );
