import { Router } from "express";
import { ID_POSTFIX } from "../common/constants.js";
import {
  add,
  select,
  remove,
  update,
  selectProduct,
} from "./product-handlers.js";
import { uploadFile } from "../common/utilies.js";
import {
  checkBody,
  checkImageExists,
  checkParams,
} from "../middleware/validate.js";

export const productRouter = Router();

productRouter
  .post("/", [uploadFile.single("image"), checkImageExists, checkBody], add)
  .delete("/:id", checkParams, remove)
  .put(
    "/:id",
    [checkParams, checkBody, uploadFile.single("image"), checkImageExists],
    update
  )
  .get("/:id", checkParams, selectProduct)
  .get("/", select);
