import { helpers } from "../helper/helpers.js";
import { createResponse, validateObjectId } from "../common/utilies.js";
import env from "../config/env.js";
import { storeMultipleFiles } from "./../common/utilies.js";
import logger from "../config/logger.js";
import { uploadFile } from "../common/utilies.js";

const validate = (schema, data, res, next) => {
  const parsed = schema.validate(data);
  if (parsed.error) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.NOT_FOUND,
      parsed.error.message,
      {},
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
      if (req.file.mimetype.startsWith("image/")) {
        const max = req.file.size > env.FILE_ALLOWED_SIZE;
        if (max) {
          const { statusCode, response } = createResponse(
            helpers.StatusCodes.NOT_ACCEPTABLE,
            helpers.responseMessages.IMAGE_MAX_SIZE
          );
          res.status(statusCode).json(response);
          logger.error({
            type: "Error",
            message: "File Not Found",
          });
          return;
        }
      }

      if (req.file.mimetype.startsWith("video/")) {
        const max = req.file.size > env.VIDEO_ALLOWED_SIZE;
        if (max) {
          const { statusCode, response } = createResponse(
            helpers.StatusCodes.NOT_ACCEPTABLE,
            helpers.responseMessages.VIDEO_MAX_SIZE
          );
          res.status(statusCode).json(response);
          logger.error({
            type: "Error",
            message: "File Not Found",
          });
          return;
        }
      }

      req.body = { ...req?.body, image: req?.file?.path };
      next();
    } else {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.NOT_FOUND,
        helpers.responseMessages.FILE_NOT_UPLOAD
      );
      res.status(statusCode).json(response);
      logger.error({
        type: "Error",
        message: "File Not Found",
      });
      return;
    }
  });
};

const multipleFile = (req, res, next) => {
  const uploadFile = storeMultipleFiles();
  const files = uploadFile.array("file", 2);

  files(req, res, function (err) {
    if (err) {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        err.message ? err.message : err
      );
      logger.error({
        type: "Error",
        message: err,
      });
      res.status(statusCode).json(response);
      return;
    }

    if (req.files.length < 0) {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.BAD_REQUEST,
        helpers.responseMessages.FILE_NOT_UPLOAD
      );
      res.status(statusCode).json(response);
      logger.error({
        type: "Error",
        message: "Uploaded files count should be max 2",
      });
      return;
    }

    if (req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const max = req.files[i].size > env.FILE_ALLOWED_SIZE;
        if (max) {
          const { statusCode, response } = createResponse(
            helpers.StatusCodes.NOT_ACCEPTABLE,
            helpers.responseMessages.IMAGE_MAX_SIZE
          );
          logger.error({
            type: "Error",
            message: "THe File size must be 2mb",
          });
          res.status(statusCode).json(response);
          return;
        }
      }
      next();
    } else {
      const { statusCode, response } = createResponse(
        helpers.StatusCodes.NOT_FOUND,
        helpers.responseMessages.FILE_NOT_UPLOAD
      );
      res.status(statusCode).json(response);
      logger.error({
        type: "Error",
        message: "Images Not Found",
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
  if (!valid) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.responseMessages.VALID_OBJECT_ID
    );
    res.status(statusCode).json(response);
    return;
  }
  next();
};

export const validateSchema = {
  body,
  params,
  file,
  query,
  multipleFile,
  objectId,
};
