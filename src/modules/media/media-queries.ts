import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { IMediaQuery } from "./typings/media.type";

/**
 * @description addMediaInfo is used to add one media entry in the database .
 * @param {IMediaQuery} mediaData - The media file is passed from service layer using mediaData.
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
 * @param {IMediaQuery} mediaData[] - media files data is passed from services using mediaData.
 * @returns {queryResult} - the result of execution of query.
 */
const addMultipleMedia = async function (mediaData: IMediaQuery[]) {
    const queryResult = await db.media.createMany({ data: mediaData });
    if (queryResult) return mediaData;
    return queryResult;
};

/**
 * @description allMedias is used to get all media entries.
 * @returns {queryResult} - the result of execution of query.
 */
const allMedias = async function () {
    const queryResult = await db.media.findMany({
        select: {
            id: true,
            filename: true,
            size: true,
            type: true,
            local_path: true,
            tag: true,
            mime_type: true,
        },
        orderBy:{
            updated_at:"desc"
        }
    });
    return queryResult;
};

/**
 * @description findManyMedias is used to find many media entries from the database.
 * @param {string} ids - The ids of many media entries is passed using ids as variable.
 * @returns {queryResult} - the result of execution of query.
 */
const findManyMedias = async function (ids: string | string[]) {
    const queryResult = await db.media.findMany({
        where: {
            id: {
                in: ids,
            },
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
        orderBy:{
            updated_at:"desc"
        }
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
        where: { id },
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
 * @description updateMediaStatusById is used to change status of one media entry.
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
 * @description deleteMediaByIds is used to delete many media entries from the database.
 * @param {string} ids- The ids of media entries are passed from body using this variable.
 * @returns {queryResult} - the result of execution of query.
 */
const deleteMediaByIds = async function (ids: string | string[]) {
    const queryResult = await db.media.deleteMany({
        where: {
            id: { in: ids },
        },
    });
    return queryResult;
};

/**
 * GET Multiple Media By Id
 * @param {[string]} ids - Mutiple Auction Ids
 * @returns {Promise<IMediaQuery>}
 */
const getMultipleActiveMediaByIds = async (ids: string[]) => {
    const query = await db.media.findMany({
        where: {
            AND: {
                id: {
                    in: ids,
                },
                status: true,
                is_deleted: false,
            },
        },
        orderBy:{
            updated_at:"desc"
        }
    });
    return query;
};

const softdeletedByIds = async (prisma: PrismaClient, id: string[]) => {
    const query = await prisma.auctions.updateMany({
        where: {
            id: {
                in: id,
            },
            is_deleted: false,
        },
        data: {
            is_deleted: true,
        },
    });
    return query;
};

const mediaQueries = {
    addMediaInfo,
    addMultipleMedia,
    allMedias,
    findManyMedias,
    getMediaById,
    updateMediaStatusById,
    deleteMediaByIds,
    getMultipleActiveMediaByIds,
    softdeletedByIds,
};
export default mediaQueries;
