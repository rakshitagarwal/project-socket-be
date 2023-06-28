import multer from "multer";
import fs from "fs";
import { ALLOWED_MIMETYPES } from "../common/constants";
import { Request } from "express";

export const uploadMultiple = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            if (!fs.existsSync("uploads"))
                fs.mkdirSync("uploads", { recursive: true });
            cb(null, `uploads`);
        },
        filename: (_req, file, cb) => {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
    limits: {
      files:10,
      fileSize: 20000000,
    },
    fileFilter: (_req: Request, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
    }
  }
});

export const uploadOne = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            if (!fs.existsSync("uploads"))
                fs.mkdirSync("uploads", { recursive: true });
            cb(null, `uploads`);
        },
        filename: (_req, file, cb) => {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
    limits: {
        files: 1,
        fileSize: 20000000,
    },
    fileFilter: (_req: Request, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});
