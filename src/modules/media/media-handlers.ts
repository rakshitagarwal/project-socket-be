import { Response, Request } from "express";
import mediaServiceProvider from "./media-services";
import IFileMetaInfo from "./typings/media.type";

/**
 * @description Add one media entry (image/video).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const uploadMedia = async (req: Request, res: Response) => {
    const response = await mediaServiceProvider.uploadMedia(
        req.file as unknown as IFileMetaInfo,
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

/**
 * @description Add multiple media entries(images).
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const uploadMultipleMedia = async (req: Request, res: Response) => {
    const response = await mediaServiceProvider.uploadMultipleMedia(
        req.files as unknown as IFileMetaInfo[],
        res.locals.id as string
    );
    res.status(response.code).json(response);
};

/**
 * @description used to retrieve all media or one specific media
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const getAllMedia = async (req: Request, res: Response) => {
    const response = await mediaServiceProvider.getAllMedia(req.params.id);
    res.status(response.code).json(response);
};

/**
 * @description updates the status of media file.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const updateMediaStatus = async (req: Request, res: Response) => {
    const response = await mediaServiceProvider.updateMediaStatus(req.params.id as unknown as string);
    res.status(response.code).json(response);
};

/**
 * @description pass ids or one id of media entries for change in is_deleted status.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {object} response gets data from services and is sent to api call with code and json.
 */
const deleteMedia = async (req: Request, res: Response) => {
    const response = await mediaServiceProvider.deleteMedia(req.body as unknown as object);
    res.status(response.code).json(response);
};

const mediaHandler = {
    uploadMedia,
    getAllMedia,
    deleteMedia,
    updateMediaStatus,
    uploadMultipleMedia,
};
export default mediaHandler;
