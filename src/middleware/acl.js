import mongoose from "mongoose";
import Joi from "joi";
import logger from "../config/logger.js";
import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { calculatePrivilages } from "./../common/utilies.js";

const demoObj = [
  {
    "name" : "Auction",
    "privillageNum" : 7
  },
  {
    "name" : "Product",
    "privillageNum" : 8
  },
  {
    "name" : "User",
    "privillageNum" : 15
  }
]

const checkAccess = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    {
      message: helpers.StatusMessages.UNAUTHORIZED,
    }
  );

  const accessArr = [];

  demoObj.forEach(obj => {
    let accessRights = {};
    const listOfRights = calculatePrivilages(obj.privillageNum)
  });

  const role = ["Admin", "Vendor"];
  const user = req.user;


  // 
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
