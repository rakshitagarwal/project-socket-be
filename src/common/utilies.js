import { readFileSync } from "fs";
import {
  ASSESTS_FILES_NAME,
  SUPPORTED_EXTENSION_FILE,
  SUPPORTED_EXTENSION_IMAGE,
} from "./../config/settings.js";
import { helpers } from "../helper/helpers.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import env from "../config/env.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import nodemailerSendgrid from "nodemailer-sendgrid";
const { compile } = handlebars;
import logger from "../config/logger.js";
import { generateKeyPair, createHash } from "crypto";
import util from "util";
import mongoose from "mongoose";
import fs from "node:fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

const jwtOptions = {
  expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  algorithm: env.ALGORITHM,
};

/**
 * common response format
 * @param {Number} statusCode
 * @param {Object} data
 * @param {String} message
 * @param {Object} metaData
 * @returns statusCode and response
 */
export const createResponse = (statusCode, message, data, metaData) => {
  const success = statusCode < helpers.StatusCodes.BAD_REQUEST;
  if (success) {
    const response = {
      success: success,
      message: message || "",
      data: data || {},
      metadata: metaData || {},
    };
    return { statusCode, response };
  }
  const response = {
    success: success,
    message: message || "",
    data: data,
    metadata: metaData,
  };
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
    accessToken: jwtToken,
    publicKey: res.publicKey,
  };
};

/**
 * validate the Token
 * @param {String} token - User's JWTToken from headers
 * @param {String} publicKey
 * @returns Object
 */
export const verifyJwtToken = (token, publicKey) => {
  // TODO: take public key from database by comparing the JWT_TOKEN
  let data = jwt.verify(token, publicKey, jwtOptions);
  return data;
};

/**
 * sent email with Dyanmic Template
 * @param {Object} payload - email template details, whom to send mail
 */
export const sendEmail = (
  payload,
  eventName,
  randomPasscode,
  text,
  liveUrl
) => {
  const verificationHTML = readFileSync(
    `assets/templates/${eventName}/index.html`,
    {
      encoding: "utf8",
    }
  );

  const verificationTemplate = compile(verificationHTML);

  const templateVariable = {
    name: payload.firstname,
    email: payload.email,
    date: payload.createdAt,
    randomPasscode: randomPasscode,
    text: text,
    liveUrl: liveUrl,
  };

  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: `${env.SG_API_KEY}`,
    })
  );

  transport
    .sendMail({
      from: env.FROM_EMAIL,
      to: "hetul491@gmail.com",
      subject: "BigDeal - Let's Start",
      html: verificationTemplate(templateVariable),
      text: text,
    })
    .catch((error) => {
      logger.error({
        type: "error",
        message: error.stack,
      });
    });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.query.moduleName) {
      cb("query parameter not found in URL");
    }

    const exists = ASSESTS_FILES_NAME.includes(req.query.moduleName);
    if (!exists) {
      cb("ModuleName should be proper");
    }

    if (!fs.existsSync(env.FILE_STORAGE_PATH + req.query.moduleName)) {
      fs.mkdirSync(env.FILE_STORAGE_PATH + req.query.moduleName);
    }
    cb(null, env.FILE_STORAGE_PATH + req?.query?.moduleName);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() / 1000 + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let fileExts = SUPPORTED_EXTENSION_FILE;

  let isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  if (!isAllowedExt) {
    cb(
      "File extension is not proper allowed are {.png & .jpeg} you have sent the ",
      file.originalname
    );
    return;
  }

  let isAllowedMimeType =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

  if (!isAllowedMimeType) {
    cb("File type should be image or video, you have sent the ", file.mimetype);
    return;
  }
  cb(null, true);
};

export const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
});

/**
 * @desription store multiple files
 */
export const storeMultipleFiles = () => {
  const multipleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!req.query.moduleName) {
        cb("query parameter not found in URL");
      }
      if (!fs.existsSync(env.FILE_STORAGE_PATH + req.query.moduleName)) {
        fs.mkdirSync(env.FILE_STORAGE_PATH + req.query.moduleName);
      }
      cb(null, env.FILE_STORAGE_PATH + req?.query?.moduleName);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() / 1000 + "_" + file.originalname);
    },
  });

  const multiplefileFilter = (req, file, cb) => {
    let fileExts = SUPPORTED_EXTENSION_IMAGE;

    let isAllowedExt = fileExts.includes(
      path.extname(file.originalname.toLowerCase())
    );
    if (!isAllowedExt) {
      cb(`File extension is not proper allowed`);
      return;
    }

    let isAllowedMimeType = file.mimetype.startsWith("image/");

    if (!isAllowedMimeType) {
      cb("File type should be image, you have sent the", file.mimetype);
      return;
    }
    cb(null, true);
  };

  const uploadFile = multer({
    storage: multipleStorage,
    limits: {
      fileSize: env.FILE_ALLOWED_SIZE,
    },
    fileFilter: multiplefileFilter,
  });

  return uploadFile;
};

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
  const valid = mongoose.isObjectIdOrHexString(objectId);
  return valid;
};

/**
 * @param data user password then hash256 password
 */
export const hashPassword = (data) => {
  const buf = Buffer.from(data, "utf8");
  const hasData = createHash("sha256").update(buf).digest("hex");
  return hasData;
};

/**
 *
 * @param data user details
 * @param res i18n object pass
 * @returns  return data
 */
export const convertToSpecificLang = function (data, res) {
  if (typeof data.message === "string") {
    data.message = res.__(data.message);
    return data;
  }
};
