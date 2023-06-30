import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { uploadMultiple, uploadOne } from "../config/multer";
import { MulterError } from "multer";
import { MESSAGES } from "../common/constants";
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
export const storeOneMedia = (req: Request,res: Response,next: NextFunction) => {
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
export const storeMultipleMedia = (req: Request,res: Response,next: NextFunction) => {
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
        const test = JSON.parse(JSON.stringify(files));
        let invalidMedia = false;
        const allowedExt = ['image/jpg' ,'image/jpeg', 'image/png'];
        for(let i=0; i< test.length; i++) {
            if(!allowedExt.includes(test[i].mimetype)) invalidMedia = true;
        }
        if(invalidMedia){
            for(let i=0; i< test.length; i++) {
                fs.unlinkSync(test[i].path);
            }
            logger.error(MESSAGES.MEDIA.MEDIA_FILES_INVALID);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_FILES_INVALID);
            return res.status(response.code).json(response);
        }

        const testMapped = test.map((_: string, i: number) => i);
        if (testMapped.length < 5) {            
            testMapped.map((i: number) => fs.unlinkSync(test[i].path));
            logger.error(MESSAGES.MEDIA.MEDIA_NOT_ALLOWED);
            const response = responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ALLOWED);
            return res.status(response.code).json(response);
        }

        return next();
    });
};
