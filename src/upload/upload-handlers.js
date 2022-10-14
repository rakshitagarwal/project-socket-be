import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { add, remove, update, multiple } from "./upload-services.js";

export const createImage = async (req, res) => {
  const { statusCode, response } = await add(
    req.headers.origin,
    req.body,
    req.query.moduleName,
    req.file
  );
  res.status(statusCode).json(response);
};

export const updateImage = async (req, res) => {
  const { statusCode, response } = await update(
    req.headers.origin,
    req.query,
    req.body,
    req.file
  );
  res.status(statusCode).json(response);
};

export const selectImage = async (req, res) => {
  const { statusCode, response } = await select(
    req.params?.id,
    req.query.moduleName,
    req.body
  );
  res.status(statusCode).json(response);
};

export const removeImage = async (req, res) => {
  const { statusCode, response } = await remove(
    req.query.moduleName,
    req.body.path
  );
  res.status(statusCode).json(response);
};

export const createVideo = async (req, res) => {
  // const { statusCode, response } = await add(
  //   req.headers.origin,
  //   req.body,
  //   req.query.moduleName,
  //   req.file
  // );
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.SERVICE_UNAVAILABLE,
    helpers.StatusMessages.SERVICE_UNAVAILABLE
  );
  res.status(statusCode).json(response);
};

export const uploadMultipleVideo = async (req, res) => {
  const { statusCode, response } = await multiple(
    req.query.moduleName,
    req.files
  );
  return res.status(statusCode).json(response);
};
