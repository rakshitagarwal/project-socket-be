import { db } from "../../config/db";
import { IMediaQuery } from "./typings/media.type";

/**
 * @description addMediaInfo is used to add one media entry in the database .
 * @param {IMediaQuery} mediaData - The media file is passed from service layer using videoData.
 * @returns {queryResult} - the result of execution of query.
 */
const addMediaInfo = async function (mediaData: IMediaQuery) {
    const queryResult = await db.media.create({
        data: mediaData,
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
 * @param {IMediaQuery} mediaData[] - media files data is passed from services using videoData.
 * @returns {queryResult} - the result of execution of query.
 */
const addMultipleMedia = async function (mediaData: IMediaQuery[]) {
    const queryResult = await db.media.createMany({ data: mediaData });
    if (queryResult) return mediaData;
    return queryResult;
};

/**
 * @description allMedias is used to get all media entries whose is_deleted is false.
 * @returns {queryResult} - the result of execution of query.
 */
const allMedias = async function () {
    const queryResult = await db.media.findMany({
        where: { is_deleted: false },
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
const findManyMedias = async function (ids: string | string[]) {
    const queryResult = await db.media.findMany({
        where: {
            id: {
                in: ids,
            },
            is_deleted: false,
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
const deleteMediaByIds = async function (ids: string | string[]) {
    const queryResult = await db.media.deleteMany({
        where: {
            id: {
                in: ids,
            },
        }
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
    deleteMediaByIds,
};

export default mediaQueries;
