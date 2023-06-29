import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { uploadMultiple, uploadOne } from "../config/multer";
import multer from "multer";
import { MESSAGES } from "../common/constants";
import logger from "../config/logger";

const uploadArray = uploadMultiple.array("media");
const uploadSingle = uploadOne.single("media");

export const storeOneMedia = (req: Request, res: Response, next: NextFunction) => {
    return uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error(MESSAGES.MEDIA.MEDIA_SINGLE_INVALID, err);
            res.status(400).json({message: MESSAGES.MEDIA.MEDIA_SINGLE_INVALID,});
        } else if (err) {
            logger.error(MESSAGES.MEDIA.MEDIA_SINGLE_INVALID, err);
            res.status(400).json({message: MESSAGES.MEDIA.MEDIA_SINGLE_INVALID,});
        }
        next();
    });
};

export const storeMultipleMedia = (req: Request, res: Response, next: NextFunction) => {
     uploadArray(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error(MESSAGES.ALL.MULTER_ERROR , err);
            return res.status(500).json({ message: MESSAGES.ALL.MULTER_ERROR });
        } else if (err) {
            logger.error(MESSAGES.ALL.MULTER_ERROR , err);
            return res.status(500).json({ message: MESSAGES.ALL.MULTER_ERROR });
        }

        const files = req.files;
        const test = JSON.parse(JSON.stringify(files));
        const testMapped = test.map((_: string, i: number) => i);
        if (!(files?.length as number)) {
            logger.error(MESSAGES.MEDIA.MEDIA_FILES_INVALID);
            return res.status(400).json({message: MESSAGES.MEDIA.MEDIA_FILES_INVALID,});
        }
        if (testMapped.length < 5) {
          testMapped.map((i: number) => fs.unlinkSync(test[i].path));
          logger.error(MESSAGES.MEDIA.MEDIA_NOT_ALLOWED);
          return res.status(400).json({ message: MESSAGES.MEDIA.MEDIA_NOT_ALLOWED });
        }
        return next();
    })
};
