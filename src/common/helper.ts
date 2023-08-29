import bcrypt from "bcrypt";
import { generateKeyPairSync } from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env";

/**
 * @param data user password
 * @return - user hash password based on hash256
 */
export const hashPassword = (password: string) => {
    const hasData = bcrypt.hashSync(password, 10);
    return hasData;
};

/**
 * generate JWT_Token on payload
 * @param {Object} payload - user details
 * @returns {String} jwtToken
 */
export const generateAccessToken = (payload: { id: string }) => {
    const key = generateKeyPairSync("rsa", {
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
    const jwtToken = jwt.sign(payload, key.privateKey, {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRED,
        algorithm: "RS256",
    });
    const refreshToken = jwt.sign(payload, key.privateKey, {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRED,
        algorithm: "RS256",
    });
    return {
        access_token: jwtToken,
        public_key: key.publicKey,
        refresh_token: refreshToken,
    };
};

/**
 * @description setReferralCode is used to set random alphanumeric referral code
 * @returns {code} - the referral code selected from available range.
 */
export const setReferralCode = () => {
    const alphanumericCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeArray = Array.from({ length: 7 }, () => {
        const randomIndex = Math.floor(Math.random() * alphanumericCharacters.length);
        return alphanumericCharacters[randomIndex];
    });
    return codeArray.join('');
}
