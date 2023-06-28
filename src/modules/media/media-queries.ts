import { db } from "../../config/db";
import { IFileMetaInfo } from "./typings/media.type";

const mediaQueries = (() => {
    const addMediaInfo = async function (videoData: IFileMetaInfo) {
        const queryResult = await db.media.create({
            data: {
                filename: videoData.filename as string,
                size: videoData.size as number,
                type: videoData.type as string,
                local_path: videoData.local_path as string,
                tag: videoData.tag as string,
                mime_type: videoData.mime_type as string,
                created_by: "bc30c4fb-eee7-4cfd-a69b-8ac166e5f3b3",
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

    const addMultipleMedia = async function (videoData: IFileMetaInfo[]) {
        const data = [];
         for(let i = 0; i < videoData.length; i++) {
            const filename= videoData[i]?.filename as string;
            const size= videoData[i]?.size as number;
            const type= videoData[i]?.type as string;
            const local_path= videoData[i]?.local_path as string;
            const tag= videoData[i]?.tag as string;
            const mime_type= videoData[i]?.mime_type as string;
            const created_by= "bc30c4fb-eee7-4cfd-a69b-8ac166e5f3b3";
            const dataElement = {filename, type, local_path, tag, mime_type, size, created_by };
            data.push(dataElement);
         }

        const queryResult = await db.media.createMany({data: data,skipDuplicates: true});
        return {queryResult, data};
    };

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
                status: true,
            },
        });
        return queryResult;
    };

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

    const updateMediaStatusById = async function(id: string, status: boolean){
        const queryResult = await db.media.update({ where: { id }, data: { status: !status },});
        return queryResult;
    }

    const deleteMediaById = async function (id: string) {
        const queryResult = await db.media.delete({where: { id },});
        return queryResult;
    };

    return { addMediaInfo, addMultipleMedia, allMedias, getMediaById, deleteMediaById, updateMediaStatusById};
})();

export default mediaQueries;
