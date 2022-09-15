import { helpers } from "../helper/helpers.js";
import { validateObjectId, createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";
import { registers } from "../common/validationSchemas.js";

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

<<<<<<< HEAD
export const checkBody = (req, res, next) => {
  const validated = registers.validate(req?.body);

  if (validated.error) {
    // Error show
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.PRECONDITION_FAILED,
      {
        message: validated.error.message,
=======
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
>>>>>>> 30916b778512552af3771dbd6ebc6255fdac1d93
      }
    );
    res.status(statusCode).json(response);
    logger.error({
      type: "Error",
<<<<<<< HEAD
      message: validated.error.message,
=======
      message: productResponse.error.stack,
>>>>>>> 30916b778512552af3771dbd6ebc6255fdac1d93
    });
  }
  next();
};
<<<<<<< HEAD
=======

const requestParams = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    { mesage: helpers.StatusMessages.BAD_REQUEST }
  );

  if (!req?.params?.id) {
    res.status(statusCode).response(response);
  }

  const valid = validateObjectId(req?.params?.id);
  if (!valid) {
    res.status(statusCode).json(response);
  }
  next();
};

export const validate = {
  requestBody,
  requestParams,
  imageExists,
};
>>>>>>> 30916b778512552af3771dbd6ebc6255fdac1d93

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
