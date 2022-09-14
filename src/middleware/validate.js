import { helpers } from "../helper/helpers.js";
import { createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";
import { registers } from "../common/validationSchemas.js";

export const checkImageExists = (req, res, next) => {
  console.log(req.file.path);
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
  next();
};

export const checkBody = (req, res, next) => {
  const validated = registers.validate(req?.body);

  if (validated.error) {
    // Error show
    const { statusCode, response } = createResponse(
      helpers.StatusCodes.PRECONDITION_FAILED,
      {
        message: validated.error.message,
      }
    );
    res.status(statusCode).json(response);
    logger.error({
      type: "Error",
      message: validated.error.message,
    });
  }
  next();
};
