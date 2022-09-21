import { helpers } from "../helper/helpers.js";
import { validateObjectId, createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";
import { uploadFile } from "../common/utilies.js";

const validate = (schema, data, res, next) => {
  const parsed = schema.validate(data);
  if (parsed.error) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.NOT_FOUND,
      parsed.error.message,
      {
        error: parsed.error.details,
      }
    );
    res.status(statusCode).json(response);
    logger.error({
      type: "Error",
      message: parsed.error.stack,
    });
    return;
  }
  next();
};

const file = (req, res, next) => {
  const uploadFiles = uploadFile.single("file");
  uploadFiles(req, res, function (err) {
    if (err) {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.NOT_ACCEPTABLE,
        err
      );
      logger.error({
        type: "Error",
        message: err,
      });
      res.status(statusCode).json(response);
      return;
    }
    if (req.file) {
      req.body = { ...req?.body, image: req?.file?.path };
      next();
    } else {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.NOT_FOUND,
        "Image " + helpers.StatusMessages.NOT_FOUND
      );
      res.status(statusCode).json(response);
      logger.error({
        type: "Error",
        message: "Image Not Found",
      });
      return;
    }
  });
};

const body = (schema) => (req, res, next) => {
  validate(schema, req.body, res, next);
};

const params = (schema) => (req, res, next) => {
  validate(schema, req.params, res, next);
};

const query = (schema) => (req, res, next) => {
  validate(schema, req.query, res, next);
};

export const validateSchema = {
  body,
  params,
  file,
  query,
};
