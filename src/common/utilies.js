import { readFileSync } from "fs";
import { helpers } from "../helper/helpers.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import env from "../config/env.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
const { compile } = handlebars;
import logger from "../config/logger.js";
import { generateKeyPair } from "crypto";
import util from "util";
import mongoose from "mongoose";

const jwtOptions = {
  expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  algorithm: env.ALGORITHM,
};

/**
 * common response format
 * @param {Number} statusCode
 * @param {Object} data
 * @returns statusCode and response
 */
export const createResponse = (statusCode, data, metaData = {}) => {
  const success = statusCode < helpers.StatusCodes.BAD_REQUEST;
  if (success) {
    const response = { success: success, data: data, metadata: metaData };
    return { statusCode, response };
  }
  const response = { success: success, data: data, metadata: metaData };
  return { statusCode, response };
};

/**
 * generate JWT_Token on payload
 *
 * @param {Object} payload - user details
 * @returns {String} jwtToken
 */
export const generateAccessToken = async (payload) => {
  const gen = util.promisify(generateKeyPair);
  const res = await gen("dsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  const jwtToken = jwt.sign(payload, res.privateKey, jwtOptions);
  return {
    accesToken: jwtToken,
    publicKey: res.publicKey,
  };
};

/**
 * validate the Token
 * @param {String} token - User's JWTToken from headers
 * @returns Object
 */
export const verifyJwtToken = (token, publicKey) => {
  // TODO: take public key from database by comparing the JWT_TOKEN
  const data = jwt.verify(token, publicKey, jwtOptions);
  return data;
};

/**
 * sent email with Dyanmic Template
 *
 * @param {Object} payload - email template details, whom to send mail
 */
export const sendEmail = (payload, eventName) => {
  const verificationHTML = readFileSync(
    `assets/templates/${eventName}}/index.html`,
    {
      encoding: "utf8",
    }
  );

  const verificationTemplate = compile(verificationHTML);

  const templateVariable = {
    name: payload.name,
    date: payload.date,
    participantCount: payload.participantCount,
  };

  const transport = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    auth: {
      pass: env.EMAIL_PASSWORD,
      user: env.EMAIL_USERNAME,
    },
  });

  transport
    .sendMail({
      from: env.FROM_EMAIL,
      to: payload.email,
      subject: payload.subject,
      html: verificationTemplate(templateVariable),
    })
    .catch((error) => {
      logger.error({
        type: "error",
        message: error.stack,
      });
    });
};

const FILE_SIZE = env.FILE_ALLOWED_SIZE; // 5mb

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.query.moduleName) {
      cb(null, "query parameter not found in URL parameters");
    }
    cb(null, env.FILE_STORAGE_PATH + req?.query?.moduleName);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: fileFilter,
});

/**
 * @description calculate previlages based on provided number
 * @param {Number} previlageNum
 * @returns
 */
export const calculatePrivilages = (previlageNum) => {
  if (previlageNum > 0) {
    const myPrevillages = [];
    const sumToOp = ["GET", "POST", "PATCH | PUT", "DELETE"];
    for (let i = sumToOp.length - 1; 0 <= i; i--) {
      if (previlageNum >= 2 ** i) {
        myPrevillages.push(sumToOp[i]);
        previlageNum = previlageNum - 2 ** i;
      }
    }
    return myPrevillages;
  }
};

/**
 * @description validate the objectId
 * @param {String} productId
 * @returns {boolean} valid
 */
export const validateObjectId = (objectId) => {
  const valid = mongoose.Types.ObjectId.isValid(objectId);
  return valid;
};
