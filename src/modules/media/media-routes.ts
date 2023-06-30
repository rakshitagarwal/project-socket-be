import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import mediaHandler from "./media-handlers";
import { storeOneMedia, storeMultipleMedia } from "../../middlewares/mediaUpload";

export const mediaRouter = Router();

mediaRouter.post(ENDPOINTS.BASE, storeOneMedia, mediaHandler.uploadMedia);

mediaRouter.post(ENDPOINTS.BASE + "multiple", storeMultipleMedia, mediaHandler.uploadMultipleMedia);

mediaRouter.get(ENDPOINTS.BASE + ":id?", mediaHandler.getAllMedia);

mediaRouter.patch(ENDPOINTS.ID, mediaHandler.updateMediaStatus);

mediaRouter.delete(ENDPOINTS.BASE , mediaHandler.deleteMedia);
