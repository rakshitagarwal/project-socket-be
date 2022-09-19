import { Router } from "express";
import { uploadFile } from "../common/utilies.js";
import { createImage, removeImage, updateImage } from "./upload-handlers.js";
import { validateSchema } from "./../middleware/validate.js";
import {
  fileName,
  moduleNameSchema,
  queryParams,
} from "./../common/validationSchemas.js";

export const uploadRouter = Router();

uploadRouter
  .post(
    "/",
    [
      uploadFile.single("image"),
      validateSchema.file,
      validateSchema.query(moduleNameSchema),
    ],
    createImage
  )
  .delete(
    "/",
    [validateSchema.query(moduleNameSchema), validateSchema.body(fileName)],
    removeImage
  )
  .put(
    "/",
    [
      uploadFile.single("image"),
      validateSchema.file,
      validateSchema.query(queryParams),
    ],
    updateImage
  );
