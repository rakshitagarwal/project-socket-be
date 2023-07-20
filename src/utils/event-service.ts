import { EventEmitter } from "events";
import { mailService } from "./mail-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import { Imail } from "./typing/utils-types";
const eventService: EventEmitter = new EventEmitter();

/**
 * @description - this event use for sending email notifications
 */
eventService.on("send-user-mail", async function (data: Imail) {
    await mailService(data);
});
eventService.on("auction:live:db:update", async function (data:{auctionId:string,state:string}) {
    auctionQueries.updateAuctionState(data.auctionId,data.state);
});

export default eventService;
