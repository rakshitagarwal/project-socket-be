import { helpers } from "../helper/helpers.js";
import { createResponse, validateObjectId } from "../common/utilies.js";
import { storeMultipleFiles } from "./../common/utilies.js";
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

const multipleFile = (req, res, next) => {
  const uploadFile = storeMultipleFiles();
  const files = uploadFile.array("file", 4);
  files(req, res, function (err) {
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

    if (req.files.length !== 4) {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        "Uploaded files count should be 4"
      );
      res.status(statusCode).json(response);
      logger.error({
        type: "Error",
        message: "Images upload count is not proper",
      });
      return;
    }
    if (req.files) {
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

const objectId = (req, res, next) => {
  const valid = validateObjectId(req.params.id);
  if (valid) {
    next();
  }
  return createResponse(
    helpers.StatusCodes.NOT_ACCEPTABLE,
    helpers.StatusMessages.NOT_ACCEPTABLE,
    {},
    {
      error: "Object Id is not Proper",
    }
  );
};

export const validateSchema = {
  body,
  params,
  file,
  query,
  multipleFile,
  objectId,
};
