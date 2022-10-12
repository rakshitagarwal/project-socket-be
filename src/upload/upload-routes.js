import { Router } from "express";

import {
  createImage,
  createVideo,
  removeImage,
  updateImage,
  uploadMultipleVideo,
} from "./upload-handlers.js";
import { validateSchema } from "./../middleware/validate.js";
import {
  fileName,
  moduleNameSchema,
  queryParams,
} from "./../common/validationSchemas.js";

export const uploadRouter = Router();

uploadRouter
  .post(
    "/video/",
    [validateSchema.query(moduleNameSchema), validateSchema.file],
    createVideo
  )
  .post(
    "/multiple/",
    [validateSchema.query(moduleNameSchema), validateSchema.multipleFile],
    uploadMultipleVideo
  )
  .post(
    "/",
    [validateSchema.query(moduleNameSchema), validateSchema.file],
    createImage
  )
  .delete(
    "/",
    [validateSchema.query(moduleNameSchema), validateSchema.body(fileName)],
    removeImage
  )
  .put(
    "/",
    [validateSchema.query(queryParams), validateSchema.file],
    updateImage
  );
