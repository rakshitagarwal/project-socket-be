import { db } from "../../config/db";
import IFileMetaInfo from "./typings/media.type";

/**
 * @description uploadMedia is used to add a media in local storage and assign id to it .
 * @param {IFileMetaInfo} videoData - The media file is passed from body using this variable
 * @returns {queryResult} - the response object using responseBuilder.
 */
const addMediaInfo = async function (videoData: IFileMetaInfo) {    
    const queryResult = await db.media.create({
        data: {
            filename: videoData.filename as string,
            size: videoData.size as number,
            type: videoData.type as string,
            local_path: videoData.local_path as string,
            tag: videoData.tag as string,
            mime_type: videoData.mime_type as string,
            created_by: videoData.created_by as string,
        },
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
            status: true,
            created_by: true,
            is_deleted: true,
        },
    });
    return queryResult;
};

/**
 * @description uploadMedia is used to add a media in local storage and assign id to it .
 * @param {IFileMetaInfo} videoData[] - The media file is passed from body using this variable
 * @returns {queryResult} - the response object using responseBuilder.
 */
const addMultipleMedia = async function (videoData: IFileMetaInfo[]) {
    const data = videoData.map((item) => ({
        filename: item?.filename as string,
        type: item?.type as string,
        local_path: item?.local_path as string,
        tag: item?.tag as string,
        mime_type: item?.mime_type as string,
        size: item?.size as number,
        created_by: item?.created_by as string,
    }));
    
    const queryResult = await db.media.createMany({data: data});
    return { queryResult, data };
};

/**
 * @description allMedias is used to get all media entries whose is_deleted is false.
 * @returns {queryResult} - the response object using responseBuilder.
 */
const allMedias = async function () {
    const queryResult = await db.media.findMany({
        where: {  is_deleted: false },   
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
            status: true,
            created_by: true,
        },
    });
    return queryResult;
};

const findManyMedias = async function (id: string[]) {
    const queryResult = await db.media.findMany({
        where: { id:{
            in: id
        }, is_deleted: false },   
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
            status: true,
            created_by: true,
        },
    });
    return queryResult;
};

/**
 * @description getMediaById is used to get one media if its is_deleted is false.
 * @param {string} id - The media file is passed from body using this variable
 * @returns {queryResult} - the response object using responseBuilder.
 */
const getMediaById = async function (id: string) {
    const queryResult = await db.media.findFirst({
        where: { id, is_deleted: false },   
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
            status: true,
            created_by: true,
            is_deleted: true,
        },
    });
    return queryResult;
};

/**
 * @description updateMediaStatusById is used to add a media in local storage and assign id to it .
 * @param {string} id- The media file is passed from body using this variable
 * @returns {queryResult} - the response object using responseBuilder.
 */
const updateMediaStatusById = async function (id: string, status: boolean) {
    const queryResult = await db.media.update({
        where: { id },
        data: { status: !status },
    });
    return queryResult;
};

/**
 * @description deleteMediaById is used to soft delete many media
 * @param {IFileMetaInfo} videoData[] - The media file is passed from body using this variable
 * @returns {queryResult} - the response object using responseBuilder.
 */
const deleteMediaById = async function (id: string) {
    const queryResult = await db.media.updateMany({
        where: { id:{
            in: id
        } },
        data: { 
            status: false, 
            is_deleted: true  
        },
    });
    return queryResult;
};

const mediaQueries = {
    addMediaInfo,
    addMultipleMedia,
    allMedias,
    getMediaById,
    deleteMediaById,
    updateMediaStatusById,
    findManyMedias
};

export default mediaQueries;
