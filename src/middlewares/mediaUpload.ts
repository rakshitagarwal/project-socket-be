import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { uploadMultiple, uploadOne } from "../config/multer";
import multer from "multer";
import { systemMessages } from "../common/constants";

const uploadArray = uploadMultiple.array("media");
const uploadSingle = uploadOne.single("media");

export const storeOneMedia = (req: Request, res: Response, next: NextFunction) => {
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: systemMessages.MEDIA.MEDIA_SINGLE_INVALID});
        } else if (err) {
            return res.status(400).json({ message: systemMessages.MEDIA.MEDIA_SINGLE_INVALID});
        }
        return next();
    });
};

export const storeMultipleMedia = (req: Request, res: Response, next: NextFunction) => {
    uploadArray(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: systemMessages.ALL.MULTER_ERROR });
        } else if (err) {
            return res.status(500).json({ message: systemMessages.ALL.MULTER_ERROR });
        }

        const files = req.files || [];
        const test = JSON.parse(JSON.stringify(files));
        if (files.length as number === 0) return res.status(400).json({ message: systemMessages.MEDIA.MEDIA_FILES_INVALID});
        if (files.length as number < 5) {
            test.filter((_: string, i: number) => i < test.length).map((file: { path: string; }) => {
                const temp = file.path;
                fs.unlinkSync(temp.toString());
            });
            return res.status(400).json({ message: systemMessages.MEDIA.MEDIA_NOT_ALLOWED });
        }
        return next();
    });
};
