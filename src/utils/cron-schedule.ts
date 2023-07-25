import { CronJob } from "cron";
import { AppGlobal } from "./socket-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import eventService from "./event-service"
import {AUCTION_STATE,PRE_REGISTER_THRESHOLD_STATUS} from "./typing/utils-types"
import {auctionStart} from "../modules/auction/auction-publisher"
import redisClient from "../config/redis";
/**
 * @description - Define the cron expression for the job to run every 2 minutes
 */
const cronExpressionEveryMin = "*/1 * * * *";
const cronExpressionEvery30Min = "*/30 * * * *";
const socket = global as unknown as AppGlobal;

/**
 * @description - Create a new CronJob instance
 */
const cronJobAuctionLive = new CronJob(cronExpressionEveryMin, async () => {
    /**
   * Get the upcoming player auctions.
   * @type {Array<UpcomingAuctionInfo>}
   */
    const upcomingAuction = await auctionQueries.upcomingPlayerAuction();
    console.log(upcomingAuction.length);
    
    if (upcomingAuction.length) {
        upcomingAuction.forEach(async(upcomingInfo): Promise<void> => {            
            const currectDate = new Date();            
            if(upcomingInfo.is_preRegistered && currectDate>=new Date(upcomingInfo.auction_pre_registeration_startDate as unknown as string)){
                const totalAuction = await auctionQueries.totalCountRegisterAuctionByAuctionId(upcomingInfo.id)
                if(upcomingInfo.registeration_count){                    
                    if(totalAuction>=upcomingInfo.registeration_count){
                        socket.playerSocket.emit("auction:state",{message:"Auction live!",auctionId:upcomingInfo.id})
                        auctionStart(upcomingInfo.id)
                        await redisClient.set(`auction:live:${upcomingInfo.id}`,JSON.stringify(upcomingInfo))
                        eventService.emit("auction:live:db:update",{auctionId:upcomingInfo.id,state:AUCTION_STATE.live})
                    }else{
                        eventService.emit("auction:live:db:update",{auctionId:upcomingInfo.id,state:AUCTION_STATE.cancelled})
                        eventService.emit("auction:reminder:mail",{auctionId:upcomingInfo.id,status:PRE_REGISTER_THRESHOLD_STATUS.not_completed})
                    }   
                }
            }
        });
    }
});

/**
 * Creates a new cron job that runs at a specified interval and performs tasks related to upcoming auctions in 30 min.
 * @param {string} cronExpression - The cron expression specifying the job's schedule.
 * @returns {CronJob} - The newly created cron job instance.
 */

const cronJob = new CronJob(cronExpressionEvery30Min, async () => {
    const upcomingAuction = await auctionQueries.upcomingPlayerAuctionReminder();        
    if (upcomingAuction.length) {
        upcomingAuction.forEach(async(upcomingInfo): Promise<void> => {            
            const currectDate = new Date();
            if(upcomingInfo.is_preRegistered && currectDate>=new Date(upcomingInfo.registeration_endDate as unknown as string)){
                    const totalAuction = await auctionQueries.totalCountRegisterAuctionByAuctionId(upcomingInfo.id)
                    if(upcomingInfo.registeration_count){                    
                        if(totalAuction>=upcomingInfo.registeration_count){
                            eventService.emit("auction:reminder:mail",{auctionId:upcomingInfo.id,status:PRE_REGISTER_THRESHOLD_STATUS.completed})
                        }else{
                            eventService.emit("auction:live:db:update",{auctionId:upcomingInfo.id,state:AUCTION_STATE.cancelled})
                            eventService.emit("auction:reminder:mail",{auctionId:upcomingInfo.id,status:PRE_REGISTER_THRESHOLD_STATUS.not_completed})
            
                        }   
                    }
                }
        });
    }
})

/**
 * @description - Check if the cron job is not already running
 * @execution - Start the cron job
 */
if (!cronJob.running) {
    cronJob.start();
}
if(!cronJobAuctionLive.running){
    cronJobAuctionLive.start()
}

export default cronJob;
