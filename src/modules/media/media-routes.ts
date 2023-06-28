import  {Router}  from "express";
import { ENDPOINTS } from "../../common/constants";
import { mediaHandler } from "./media-handlers";
import { storeOneMedia, storeMultipleMedia } from "../../middlewares/mediaUpload";

export const mediaRouter = Router();

mediaRouter.post(ENDPOINTS.UPLOAD, storeOneMedia, mediaHandler.uploadMedia);

mediaRouter.post(ENDPOINTS.UPLOAD + "multiple", storeMultipleMedia, mediaHandler.uploadMultipleMedia);

mediaRouter.get(ENDPOINTS.BASE + ":id?", mediaHandler.getAllMedia);

mediaRouter.patch(ENDPOINTS.UPDATE + ':id?', mediaHandler.updateMediaStatus);

mediaRouter.delete(ENDPOINTS.DELETE + ':id?', mediaHandler.deleteMedia);
