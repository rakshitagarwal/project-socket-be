import { helpers } from "../helper/helpers.js";
import { validateObjectId, createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";

const imageExists = (req, res, next) => {
  if (!req.file) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.NOT_FOUND,
      {
        message: "Image" + helpers.StatusMessages.NOT_FOUND,
      }
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

const requestBody = (schema) => (req, res, next) => {
  const productResponse = schema.validate(req?.body);

  if (productResponse.error) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.NOT_FOUND,
      {
        message: productResponse.error.message,
      },
      {
        error: productResponse.error.details,
      }
    );
    res.status(statusCode).json(response);
    logger.error({
      type: "Error",
      message: productResponse.error.stack,
    });
    return;
  }
  next();
};

const requestParams = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    { mesage: helpers.StatusMessages.BAD_REQUEST }
  );

  if (!req?.params?.id) {
    res.status(statusCode).response(response);
    return;
  }

  const valid = validateObjectId(req?.params?.id);
  if (!valid) {
    res.status(statusCode).json(response);
    return;
  }
  next();
};

const requestQueryParams = (schemas) => (req, res, next) => {
  const validated = schemas.validate({
    page: req?.query?.page,
    limit: req?.query?.limit,
  });

  if (validated.error) {
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      { mesage: helpers.StatusMessages.BAD_REQUEST },
      {
        error: validated.error.details,
      }
    );
    res.status(statusCode).json(response);
    return;
  }

  next();
};

export const validate = {
  requestBody,
  requestParams,
  imageExists,
  requestQueryParams,
};
