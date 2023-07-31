import { CronJob } from "cron";
import { AppGlobal } from "./socket-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import eventService from "./event-service";
import {
    SOCKET_EVENT,
    NODE_EVENT_SERVICE,
    MESSAGES,
} from "../common/constants";
import { AUCTION_STATE } from "./typing/utils-types";
import { auctionStart } from "../modules/auction/auction-publisher";
import redisClient from "../config/redis";
/**
 * @description - Define the cron expression for the job to run every 2 minutes
 */
const cronExpressionEveryMin = "*/1 * * * *";
// const cronExpressionEvery30Min = "*/30 * * * *";
const socket = global as unknown as AppGlobal;

/**
 * Creates a new cron job that runs at a specified interval and performs tasks related to upcoming auctions in 1 min.
 * @param {string} cronExpression - The cron expression specifying the job's schedule.
 * @returns {CronJob} - The newly created cron job instance.
 */
const cronJobAuctionLive = new CronJob(cronExpressionEveryMin, async () => {
    /**
     * Get the upcoming player auctions.
     * @type {Array<UpcomingAuctionInfo>}
     */
    const upcomingAuction = await auctionQueries.upcomingPlayerAuction();
    if (upcomingAuction.length) {
        upcomingAuction.forEach(async (upcomingInfo): Promise<void> => {
            const currectDate = new Date();
            if (
                upcomingInfo.is_preRegistered &&
                upcomingInfo.start_date &&
                currectDate >=
                    new Date(upcomingInfo.start_date as unknown as string)
            ) {
                socket.playerSocket.emit(SOCKET_EVENT.AUCTION_STATE, {
                    message: MESSAGES.SOCKET.AUCTION_LIVE,
                    auctionId: upcomingInfo.id,
                });
                auctionStart(upcomingInfo.id);
                await redisClient.set(`auction:live:${upcomingInfo.id}`,JSON.stringify(upcomingInfo));
                eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE, {auctionId: upcomingInfo.id,state: AUCTION_STATE.live,});
                await eventService.emit(NODE_EVENT_SERVICE.UPDATE_PLAYER_REGISTER_STATUS,upcomingInfo.id)
            }
        });
    }
});

/**
 * Creates a new cron job that runs at a specified interval and performs tasks related to upcoming auctions in 30 min.
 * @param {string} cronExpression - The cron expression specifying the job's schedule.
 * @returns {CronJob} - The newly created cron job instance.
 */

// const cronJob = new CronJob(cronExpressionEvery30Min, async () => {
//     const upcomingAuction = await auctionQueries.upcomingPlayerAuctionReminder();
//     if (upcomingAuction.length) {
//         upcomingAuction.forEach(async(upcomingInfo): Promise<void> => {
//             const currectDate = new Date();
//             if(upcomingInfo.is_preRegistered && currectDate>=new Date(upcomingInfo.registeration_endDate as unknown as string)){
//                     const totalAuction = await auctionQueries.totalCountRegisterAuctionByAuctionId(upcomingInfo.id)
//                     if(upcomingInfo.registeration_count){
//                         if(totalAuction>=upcomingInfo.registeration_count){
//                             eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL,{auctionId:upcomingInfo.id,status:PRE_REGISTER_THRESHOLD_STATUS.completed})
//                         }else{
//                             eventService.emit(NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE,{auctionId:upcomingInfo.id,state:AUCTION_STATE.cancelled})
//                             eventService.emit(NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL,{auctionId:upcomingInfo.id,status:PRE_REGISTER_THRESHOLD_STATUS.not_completed})

//                         }
//                     }
//                 }
//         });
//     }
// })

/**
 * @description - Check if the cron job is not already running
 * @execution - Start the cron job
 */
// if (!cronJob.running) {
//     cronJob.start();
// }
if (!cronJobAuctionLive.running) {
    cronJobAuctionLive.start();
}

export default cronJobAuctionLive;
