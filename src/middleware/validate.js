import { helpers } from "../helper/helpers.js";
import { createResponse } from "../common/utilies.js";
import logger from "../config/logger.js";

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
