import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import mediaQueries from "./media-queries";
import IFileMetaInfo from "./typings/media.type";
import fs from "fs";

/**
 * @description uploadMedia is used to add a media in local storage and assign id to it .
 * @param {IFileMetaInfo} reqFileData - The media file is passed from body using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMedia = async (reqFileData: IFileMetaInfo, userId: string) => {
    if (!reqFileData) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
    const temp = JSON.parse(JSON.stringify(reqFileData));
    const fileData = {
        filename: reqFileData.filename,
        type: (temp?.mimetype as string).includes("image") ? "image" : "video",
        local_path: reqFileData.path,
        tag: "media",
        mime_type: temp.mimetype,
        size: reqFileData.size,
        created_by: userId,
    };

    const mediaResult = await mediaQueries.addMediaInfo(fileData);
    return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult);
};

/**
 * @description uploadMultipleMedia is used to add multiple media in local storage and assign ids to them.
 * @param {IFileMetaInfo} reqFileData[] - The media files are passed using this variable to queries
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMultipleMedia = async (reqFileData: IFileMetaInfo[], userId: string) => {
    if (!reqFileData) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
    const temp = JSON.parse(JSON.stringify(reqFileData));
    const filesData = [];
    for (let i = 0; i < reqFileData.length; i++) {
        filesData.push({
            filename: reqFileData[i]?.filename,
            type: "image",
            local_path: reqFileData[i]?.path,
            tag: "media",
            mime_type: temp[i]?.mimetype,
            size: reqFileData[i]?.size,
            created_by: userId,
        });
    }

    const mediaResult = await mediaQueries.addMultipleMedia(filesData);
    return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult.data);
};

/**
 * @description getAllMedia is used to retrieve one media or all media based on id passed or not .
 * @param {string | undefined} mediaId id is passed to specify which media file to retrieve.
 * @returns {object} - the response object using responseBuilder.
 */
const getAllMedia = async (mediaId: string | undefined) => {
    if (mediaId) {
        const media = await mediaQueries.getMediaById(mediaId);
        if (media) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, [media]);
        return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
    }
    const medias = await mediaQueries.allMedias();
    return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, medias);
};

/**
 * @description updateMediaStatus is used to change the status of the media based on id.
 * @param {string} id - id is passed to specify on which media file action will take place.
 * @returns {object} - the response object using responseBuilder.
 */
const updateMediaStatus = async (id: string) => {
    if (!id) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_ID);
    const media = await mediaQueries.getMediaById(id);
    if (media) {
        const result = await mediaQueries.updateMediaStatusById(id, media.status);
        return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    }
    return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_NOT_FOUND);
};

/**
 * @description deleteMedia is used to delete media fileS
 * @param {string} ids - ids are passed to specify which media files soft delete will happen.
 * @returns {object} - the response object using responseBuilder.
 */
const deleteMedia = async (ids: object) => {
    if (!ids) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_ID);
    const temp = JSON.parse(JSON.stringify(ids));
    const allIds = temp.id;
    if (allIds.length < 1) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_MIN_ID);

    const media = await mediaQueries.findManyMedias(allIds);
    if (media.length === allIds.length) await mediaQueries.deleteMediaById(allIds);
    media.map((item) => fs.unlinkSync(`${item?.local_path}`));
    return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_DELETE_SUCCESS);
};

const mediaServiceProvider = {
    uploadMedia,
    uploadMultipleMedia,
    getAllMedia,
    deleteMedia,
    updateMediaStatus,
};

export default mediaServiceProvider;
