import { readFileSync } from "fs";
import { helpers } from "../helper/helpers.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
const { compile } = handlebars;
import logger from "../config/logger.js";
import { generateKeyPair } from "crypto";
import util from "util";
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
export const createResponse = (statusCode, data) => {
  const success = statusCode < helpers.StatusCodes.BAD_REQUEST;
  if (success) {
    const response = { success: success, data: data };
    return { statusCode, response };
  }
  const response = { success: success, error: data };
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
      console.log(error);
    });
};
