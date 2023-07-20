import { CronJob } from "cron";
import { AppGlobal } from "./socket-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import eventService from "./event-service"
import {AUCTION_STATE} from "./typing/utils-types"
import {auctionStart} from "../modules/auction/auction-publisher"
/**
 * @description - Define the cron expression for the job to run every 5 minutes
 */
const cronExpression = "* */1 * * * *";

const socket = global as unknown as AppGlobal;

/**
 * @description - Create a new CronJob instance
 */
const cronJob = new CronJob(cronExpression, async () => {
    const upcomingAuction = await auctionQueries.upcomingPlayerAuction();
    if (upcomingAuction.length) {
        upcomingAuction.forEach(async(upcomingInfo): Promise<void> => {
            const currectDate = new Date();
            if(upcomingInfo.is_preRegistered && currectDate>=new Date(upcomingInfo.auction_pre_registeration_startDate as unknown as string)){
                const totalAuction = await auctionQueries.totalCountRegisterAuctionByAuctionId(upcomingInfo.id)
                if(upcomingInfo.registeration_count){
                    if(totalAuction>=upcomingInfo?.registeration_count){
                        socket.playerSocket.emit("auction:state",{message:"Auction live!",auctionId:upcomingInfo.id})
                        auctionStart(upcomingInfo.id)
                        eventService.emit("auction:live:db:update",{auctionId:upcomingInfo.id,state:AUCTION_STATE.live})
                    }else{
                        eventService.emit("auction:live:db:update",{auctionId:upcomingInfo.id,state:AUCTION_STATE.cancelled})
                    }   
                }
            }
        });
    }
});

/**
 * @description - Check if the cron job is not already running
 * @execution - Start the cron job
 */
if (!cronJob.running) {
    cronJob.start();
}

export default cronJob;
