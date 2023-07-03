import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import mediaHandler from "./media-handlers";
import { storeOneMedia, storeMultipleMedia } from "../../middlewares/mediaUpload";
import validateRequest from "../../middlewares/validateRequest";
import mediaSchema from "./media-schemas";

export const mediaRouter = Router();

mediaRouter.post(ENDPOINTS.BASE, storeOneMedia, mediaHandler.uploadMedia);
mediaRouter.post(ENDPOINTS.BASE + "multiple", storeMultipleMedia, mediaHandler.uploadMultipleMedia);
mediaRouter.get(ENDPOINTS.BASE + ":id?", mediaHandler.getAllMedia);
mediaRouter.patch(ENDPOINTS.BASE + ":id", validateRequest.params(mediaSchema.uuidSchema), mediaHandler.updateMediaStatus);
mediaRouter.delete(ENDPOINTS.BASE , validateRequest.body(mediaSchema.requestBodySchema), mediaHandler.deleteMedia);
