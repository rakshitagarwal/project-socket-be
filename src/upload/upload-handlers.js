import { add, remove, update } from "./upload-services.js";

export const createImage = async (req, res) => {
  const { statusCode, response } = await add(
    req.body,
    req.query.moduleName,
    req.file
  );
  res.status(statusCode).json(response);
};

export const updateImage = async (req, res) => {
  const { statusCode, response } = await update(req.query, req.body, req.file);
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
