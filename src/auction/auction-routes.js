import { Router } from "express";
import { validateSchema } from "./../middleware/validate.js";
import { auctionSchema } from "./../common/validationSchemas.js";
import { add, fetchAll } from "./../auction/auction-handlers.js";

export const auctionRouter = Router();

auctionRouter.post("/", [validateSchema.body(auctionSchema)], add);
auctionRouter.get("/", fetchAll);
