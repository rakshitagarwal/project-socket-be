import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { uploadMultiple, uploadOne } from "../config/multer";
import { MulterError } from "multer";
import { ALLOWED_IMAGE_MIMETYPES, MESSAGES } from "../common/constants";
import logger from "../config/logger";
import { responseBuilder } from "../common/responses";

const uploadArray = uploadMultiple.array("media");
const uploadSingle = uploadOne.single("media");

/**
 * @description storeOneMedia calls multer middleware, store media in local storage and pass to handlers.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The media file is passed from body using this variable
 * @returns {response} - the response object using responseBuilder.
 */
export const storeOneMedia = (req: Request, res: Response, next: NextFunction) => {
    uploadSingle(req, res, function (err) {
        if (err instanceof MulterError) {
            logger.error(MESSAGES.MEDIA.MEDIA_SINGLE_INVALID, err);
            const response = responseBuilder.badRequestError(err.message);
            return res.status(response.code).json(response);
        } else if (err) {
            logger.error(MESSAGES.MEDIA.MEDIA_SINGLE_INVALID, err);
            const response = responseBuilder.badRequestError(err.message);
            return res.status(response.code).json(response);
        }
        if(!req.file){
            logger.error(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
            return res.status(response.code).json(response);
        }
        
        return next();
    });
};

/**
 * @description storeMultipleMedia calls multer middleware, store multiple medias in local storage and pass to handlers.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next object.
 * @returns {response} - the response object using responseBuilder.
 */
export const storeMultipleMedia = (req: Request, res: Response, next: NextFunction) => {
    uploadArray(req, res, function (err) {
        if (err instanceof MulterError) {
            logger.error(MESSAGES.ALL.MULTER_ERROR, err);
            const response = responseBuilder.badRequestError(err.message);
            return res.status(response.code).json(response);
        } else if (err) {
            logger.error(MESSAGES.ALL.MULTER_ERROR, err);
            const response = responseBuilder.badRequestError(err.message);
            return res.status(response.code).json(response);
        }

        const files = req.files;
        const multipleFiles = JSON.parse(JSON.stringify(files));
        if (!multipleFiles.length) {
            logger.error(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
            return res.status(response.code).json(response);
        }
        const invalidMedia = multipleFiles
            .map((file: { mimetype: string }) => !ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype))
            .some((result: boolean) => result);

        if (invalidMedia) {
            multipleFiles.map((file: { path: string }) => fs.unlinkSync(file.path));
            logger.error(MESSAGES.MEDIA.MEDIA_FILES_INVALID);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_FILES_INVALID);
            return res.status(response.code).json(response);
        }
        if (multipleFiles.length < 5) {
            multipleFiles.map((file: { path: string }) => fs.unlinkSync(file.path));
            logger.error(MESSAGES.MEDIA.MEDIA_NOT_ALLOWED);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ALLOWED);
            return res.status(response.code).json(response);
        }

        return next();
    });
};
