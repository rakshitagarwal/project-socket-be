import { helpers } from "../helper/helpers.js";
import { checkObjectId, createResponse } from "../common/utilies.js";
import { productSchema } from "../common/validationSchemas.js";
import logger from "../config/logger.js";

export const checkImageExists = (req, res, next) => {
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
  }
  req.body = { ...req?.body, image: req?.file?.path };
  next();
};

export const checkBody = (req, res, next) => {
  const productResponse = productSchema.validate(req?.body);

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
  }
  next();
};

export const checkParams = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    { mesage: helpers.StatusMessages.UNAUTHORIZED }
  );

  if (!req?.params?.id) {
    res.status(statusCode).response(response);
  }

  const valid = checkObjectId(req?.params?.id);
  if (!valid) {
    res.status(statusCode).response(response);
  }
  next();
};
