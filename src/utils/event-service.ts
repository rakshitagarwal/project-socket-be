import { EventEmitter } from "events";
import { mailService } from "./mail-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import { Imail } from "./typing/utils-types";
import { TEMPLATE } from "../common/constants";
import { PRE_REGISTER_THRESHOLD_STATUS } from "./typing/utils-types";
import redisClient from "../config/redis"
import userQueries from "../modules/users/user-queries"
const eventService: EventEmitter = new EventEmitter();

/**
 * @description - this event use for sending email notifications
 */
eventService.on("send-user-mail", async function (data: Imail) {
    await mailService(data);
});

/**
 * Event handler function that sends auction reminder or cancellation emails to registered players.
 *
 * @param {Object} data - The event data containing auctionId and status.
 * @param {string} data.auctionId - The ID of the auction.
 * @param {string} data.status - The status of the auction.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
eventService.on(
    "auction:reminder:mail",
    async function (data: { auctionId: string; status: string }) {
        const playerInformation =
            await auctionQueries.playerRegistrationAuction(data.auctionId);
    
        if (playerInformation.length) {
            const auctionInfo = playerInformation[0];
            const userEmail = playerInformation.map(
                (player) => player.User.email
            );
            if (data.status === PRE_REGISTER_THRESHOLD_STATUS.completed) {
                                /**
                 * Data object for sending a player registration reminder email.
                 *
                 * @typedef {Object} ReminderEmailData
                 * @property {string} email - The email address of the recipient.
                 * @property {string} template - The template to use for the email content.
                 * @property {string} subject - The subject of the email.
                 * @property {string} message - The message content of the email.
                 */

                const data = {
                    email: userEmail,
                    template: TEMPLATE.PLAYER_REGISTERATION,
                    subject: "Reminder for Auction start",
                    message: `${auctionInfo?.Auctions?.title} auction will go live after 24 hours`,
                };
                await mailService(data);
            } else {
                 /**
                 * Data object for sending an auction cancellation email.
                 *
                 * @typedef {Object} CancellationEmailData
                 * @property {string} email - The email address of the recipient.
                 * @property {string} template - The template to use for the email content.
                 * @property {string} subject - The subject of the email.
                 * @property {string} message - The message content of the email.
                 */

                const data = {
                    email: userEmail,
                    template: TEMPLATE.PLAYER_REGISTERATION,
                    subject: "Auction cancelled",
                    message: `${auctionInfo?.Auctions?.title} has been cancelled `,
                };
                await mailService(data);
            }
        }
    }
);


/**
 * Event handler function that updates the state of an auction in the database.
 * @param {Object} data - The event data containing auctionId and state.
 * @param {string} data.auctionId - The ID of the auction to update.
 * @param {string} data.state - The new state to set for the auction.
 * @returns {Promise<void>} - A promise that resolves when the auction state is updated successfully.
 */
eventService.on(
    "auction:live:db:update",
    async function (data: { auctionId: string; state: string }) {
        auctionQueries.updateAuctionState(data.auctionId, data.state);
    }
);

eventService.on("auction:closed",async(auctionId:string)=>{
    const auctionBidLog=await redisClient.get(`${auctionId}:bidHistory`)
    if(auctionBidLog){
        const winnerePayload=JSON.parse(auctionBidLog)
        await userQueries.playerBidLog(winnerePayload)
        const newWinnerPayload=winnerePayload[winnerePayload.length-1]
        let total_bids=0
        winnerePayload.forEach((playerInfo:{player_id:string,player_bot_id:string})=>{
            if(newWinnerPayload.player_id===playerInfo.player_id && playerInfo.player_bot_id){
                total_bids+=1
            }
        })
        await userQueries.playerAuctionWinner({
            player_id:newWinnerPayload.player_id,
            auction_id:newWinnerPayload.auction_id,
            player_bot_id:newWinnerPayload.player_bot_id,
            total_bids
        })

    }
})

export default eventService;
