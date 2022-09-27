import { Router } from "express";
import { validateSchema } from "./../middleware/validate.js";
import {
  auctionSchema,
  auctionSearchSchema,
  idSchema,
  paginationSchema,
} from "./../common/validationSchemas.js";
import {
  add,
  fetchAll,
  update,
  fetchCategories,
  remove,
  selectAuction,
  searchAuction,
} from "./../auction/auction-handlers.js";

export const auctionRouter = Router();

auctionRouter
  .get("/category/", fetchCategories)
  .get("/search/", validateSchema.query(auctionSearchSchema), searchAuction)
  .post("/", [validateSchema.body(auctionSchema)], add)
  .get("/", validateSchema.query(paginationSchema), fetchAll)
  .put(
    "/:id",
    [
      validateSchema.objectId,
      validateSchema.params(idSchema),
      validateSchema.body(auctionSchema),
    ],
    update
  )
  .delete(
    "/:id",
    [validateSchema.objectId, validateSchema.params(idSchema)],
    remove
  )
  .get(
    "/:id",
    [validateSchema.objectId, validateSchema.params(idSchema)],
    selectAuction
  );
