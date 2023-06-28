import { MESSAGES } from "../../common/constants";
import { responseBuilder } from "../../common/responses";
import mediaQueries from "./media-queries";
import { IFileMetaInfo } from "./typings/media.type";
import fs from 'fs';

export const mediaServiceProvider = (() => {
/**
 * @description uploadMedia is used to add a media in local storage and assign id to it .
 * @param {IFileMetaInfo} listOfFilesMetaData - The media file is passed from body using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMedia = async function (listOfFilesMetaData: IFileMetaInfo) {      
    if (listOfFilesMetaData === undefined) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);          
    const fileData = JSON.parse(JSON.stringify(listOfFilesMetaData));

    const mediaResult = await mediaQueries.addMediaInfo({
        filename: listOfFilesMetaData.filename,
        type: (fileData?.mimetype as string).includes("image")? "image": "video",
        local_path: listOfFilesMetaData.path,
        tag: "media",
        mime_type: fileData.mimetype,
        size: listOfFilesMetaData.size,
    });
    return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult);
};

/**
 * @description uploadMedia is used to add a media in local storage and assign id to it .
 * @param {IFileMetaInfo} listOfFilesMetaData - The media file is passed from body using this variable
 * @returns {object} - the response object using responseBuilder.
 */
const uploadMultipleMedia = async function (listOfFilesMetaData: IFileMetaInfo[]) {          
    if (listOfFilesMetaData === undefined) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_NOT_ATTACHED);
    const fileData = JSON.parse(JSON.stringify(listOfFilesMetaData));
    const data = [];
    for(let i = 0; i < listOfFilesMetaData.length; i++){
        const filename= listOfFilesMetaData[i]?.filename;
        const type= (fileData[i]?.mimetype as string).includes("image")? "image": "video";
        const local_path= listOfFilesMetaData[i]?.path;
        const tag= "media";
        const mime_type= fileData[i]?.mimetype;
        const size= listOfFilesMetaData[i]?.size;
        const oneElement = {filename, type, local_path, tag, mime_type, size };
        data.push(oneElement);
    }
    const mediaResult = await mediaQueries.addMultipleMedia(data);
    return responseBuilder.createdSuccess(MESSAGES.MEDIA.MEDIA_CREATE_SUCCESS, mediaResult.data);
};

/**
 * @description getAllMedia is used to retrieve one media or all media based on id passed or not .
 * @param {string | undefined} mediaId id is passed to specify which media file to retrieve.
 * @returns {object} - the response object using responseBuilder.
 */
const getAllMedia = async function (mediaId: string | undefined) {
    if (mediaId) {
        const media = await mediaQueries.getMediaById(mediaId);
        if (media) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, [media]);
        return responseBuilder.notFoundError();
    }
        const medias = await mediaQueries.allMedias();
        if (medias.length) return responseBuilder.okSuccess(MESSAGES.MEDIA.REQUEST_MEDIA, medias);
        return responseBuilder.notFoundError();
};

/**
 * @description updateMediaStatus is used to change the status of the media based on id.
 * @param {string} id - id is passed to specify on which media file action will take place.
 * @returns {object} - the response object using responseBuilder.
 */
const updateMediaStatus = async function (id: string) {
    if (id === undefined) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_ID);                
    const media = await mediaQueries.getMediaById(id);        
    if (media) {
        const result = await mediaQueries.updateMediaStatusById(id, media.status);
        return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_STATUS_CHANGE_SUCCESS, result);
    }
    return responseBuilder.notFoundError();
}

/**
 * @description deleteMedia is used to delete a media file
 * @param {string} id - id is passed to specify on which media file action will take place.
 * @returns {object} - the response object using responseBuilder.
 */
const deleteMedia = async function (id: string) {
    if (id === undefined) return responseBuilder.badRequestError(MESSAGES.MEDIA.MEDIA_ID);                
    const media = await mediaQueries.getMediaById(id);

    if (media) {
        const isDeleted = await mediaQueries.deleteMediaById(id);
        fs.unlink(`${media?.local_path}`, (err: NodeJS.ErrnoException | null) => {
            if (err) throw new Error(MESSAGES.MEDIA.MEDIA_DELETE_FAIL);});
        if (isDeleted) return responseBuilder.okSuccess(MESSAGES.MEDIA.MEDIA_DELETE_SUCCESS, isDeleted);
        return responseBuilder.internalserverError();
    }
    return responseBuilder.notFoundError();
};

return { uploadMedia, uploadMultipleMedia, getAllMedia, deleteMedia, updateMediaStatus };
})();
