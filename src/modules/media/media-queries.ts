import { db } from "../../config/db";
import {IFileMetaInfo} from "./typings/media.type";

/**
 * @description addMediaInfo is used to add one media entry in the database .
 * @param {IFileMetaInfo} videoData - The media file is passed from service layer using videoData.
 * @returns {queryResult} - the result of execution of query.
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
        },
    });
    return queryResult;
};

/**
 * @description addMultipleMedia is used to add multiple media entries in the database.
 * @param {IFileMetaInfo} videoData[] - media files data is passed from services using videoData.
 * @returns {queryResult} - the result of execution of query.
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
 * @returns {queryResult} - the result of execution of query.
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
        },
    });
    return queryResult;
};

/**
 * @description findManyMedias is used to find many media entries from the database.
 * @param {string} ids - The ids of media entries is passed using ids as variable.
 * @returns {queryResult} - the result of execution of query.
 */
const findManyMedias = async function (ids: string) {
    const queryResult = await db.media.findMany({
        where: { id:{
            in: ids
        }, is_deleted: false },   
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
        },
    });
    return queryResult;
};

/**
 * @description getMediaById is used to get one media if its is_deleted is false.
 * @param {string} id - The id of one media is passed using this variable.
 * @returns {queryResult} - the result of execution of query.
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
        },
    });
    return queryResult;
};

/**
 * @description updateMediaStatusById is used to change status of media entry in database.
 * @param {string} id- The id of one media is passed using this variable.
 * @returns {queryResult} - the result of execution of query.
 */
const updateMediaStatusById = async function (id: string, status: boolean) {
    const queryResult = await db.media.update({
        where: { id },
        data: { status: !status },
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
            status: true,
        },
    });
    return queryResult;
};

/**
 * @description deleteMediaByIds is used to soft delete many media entries in database.
 * @param {string} ids- The ids of media entries are passed from body using this variable.
 * @returns {queryResult} - the result of execution of query.
 */
const deleteMediaByIds = async function (ids: string) {
    const queryResult = await db.media.updateMany({
        where: { id:{
            in: ids
        } },
        data: { 
            is_deleted: true  
        },
    });
    return queryResult;
};

const mediaQueries = {
    addMediaInfo,
    addMultipleMedia,
    allMedias,
    findManyMedias,
    getMediaById,
    updateMediaStatusById,
    deleteMediaByIds
};

export default mediaQueries;
