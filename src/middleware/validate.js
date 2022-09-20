import { helpers } from "../helper/helpers.js";
import { validateObjectId, createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";
import { registers } from "../common/validationSchemas.js";

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
  console.log(req.file);
  if (!req.file) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.NOT_FOUND,
      "Image" + helpers.StatusMessages.NOT_FOUND
    );
    res.status(statusCode).json(response);
    logger.error({
      type: "Error",
      message: "Image Not Found",
    });
    return;
  }
  req.body = { ...req?.body, image: req?.file?.path };
  next();
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
