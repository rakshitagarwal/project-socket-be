import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import mediaQueries from "./media-queries";
import {IFileMetaInfo, Iid, IMediaQuery} from "./typings/media.type";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

/**
 * @description uploadMedia is used to add one media entry in the database
 * @param {IFileMetaInfo} reqFileData - The media file is passed from body using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMedia = async (reqFileData: IFileMetaInfo, userId: string) => {
    const fileData = {
        id: uuidv4(),
        filename: reqFileData.filename,
        type: (reqFileData?.mimetype as string).split('/')[0],
        local_path: reqFileData.path,
        tag: "media",
        mime_type: reqFileData.mimetype,
        size: reqFileData.size,
        created_by: userId,
    };

    const mediaResult = await mediaQueries.addMediaInfo(fileData as IMediaQuery);
    if (mediaResult) return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, fileData);
    return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_CREATE_FAIL);};

/**
 * @description uploadMultipleMedia is used to add multiple media entries in the databse.
 * @param {IFileMetaInfo} reqFileData[] - The media files are passed using this variable to queries.
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMultipleMedia = async (reqFileData: IFileMetaInfo[], userId: string) => {  
    const filesData = [];
    for (let i = 0; i < reqFileData.length; i++) {
        filesData.push({
            id: uuidv4(),
            filename: reqFileData[i]?.filename,
            type: reqFileData[i]?.mimetype?.split('/')[0],
            local_path: reqFileData[i]?.path,
            tag: "media",
            mime_type: reqFileData[i]?.mimetype,
            size: reqFileData[i]?.size,
            created_by: userId,
        });
    } 

    const mediaResult = await mediaQueries.addMultipleMedia(filesData as IMediaQuery[]);
    if (mediaResult) return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult);
    return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_CREATE_FAIL);
};

/**
 * @description getAllMedia retrieves one media or all media based on id passed or not.
 * @param {string | undefined} mediaId id passed to specify which media file to retrieve.
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
const deleteMedia = async (deleteIds: Iid) => {        
    const media = await mediaQueries.findManyMedias(deleteIds.ids);
    if (media.length !== deleteIds.ids.length) return responseBuilder.notFoundError(MESSAGES.MEDIA.MEDIA_IDS_NOT_FOUND);
    if (media.length === deleteIds.ids.length) await mediaQueries.deleteMediaByIds(deleteIds.ids);
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
