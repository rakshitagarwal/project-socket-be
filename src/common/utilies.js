import { helpers } from "../helper/helpers.js";
import jwt from "jsonwebtoken";
import forge from "node-forge";
import { env } from "../config/env.js";

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
 * @param {Object} data
 * @returns String
 */
export const generateAccessToken = (payload) => {
  // It will return PRIVATE_KEY and PUBLIC_KEY
  const KEY = forge.pki.rsa.generateKeyPair({
    bits: 256,
    workers: 2,
  });

  // TODO: store the JWT_Token in the database
  const jwtToken = jwt.sign(payload, KEY.privateKey, jwtOptions);

  return {
    accestoken: jwtToken,
  };
};

/**
 * validate the Token
 * @param {String} token
 * @returns Object
 */
export const verifyJwtToken = (token) => {
  // TODO:take public key from database by comparing the JWT_TOKEN
  const data = jwt.verify(token, publicKey, jwtOptions);
  return data;
};
