import mongoose from "mongoose";
import Joi from "joi";
import { ADMIN_PATH, VENDOR_PATH } from "../common/constants.js";
import logger from "../config/logger.js";
import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";

const checkAccess = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    {
      message: helpers.StatusMessages.UNAUTHORIZED,
    }
  );
  const role = ["Admin", "Vendor"];
  const user = req.user;

  //   TODO: extract role ,privilages List from user's request

  switch (role) {
    case "Admin":
      next();
      break;

    case "Vendor":
      next();
      break;

    default:
      res.status(statusCode).json(response);
      logger.error({
        type: "error",
        message: "UnAuthorized",
      });
      break;
  }
};
