import { EventEmitter } from "events";
import { auctionState } from "@prisma/client";
import { mailService } from "./mail-service";
import { auctionQueries } from "../modules/auction/auction-queries";
import { Imail } from "./typing/utils-types";
import {
    TEMPLATE,
    NODE_EVENT_SERVICE,
    SOCKET_EVENT,
    MESSAGES,
} from "../common/constants";
import { PRE_REGISTER_THRESHOLD_STATUS } from "./typing/utils-types";
import { Ispend_on } from "../modules/users/typings/user-types";
import redisClient from "../config/redis";
import userQueries from "../modules/users/user-queries";
import { AppGlobal } from "./socket-service";
const eventService: EventEmitter = new EventEmitter();
const socket = global as unknown as AppGlobal;

/**
 * @description - this event use for sending email notifications
 */
eventService.on(NODE_EVENT_SERVICE.USER_MAIL, async function (data: Imail) {
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
    NODE_EVENT_SERVICE.AUCTION_REMINDER_MAIL,
    async function (data: { auctionId: string; status: string }) {
        const playerInformation =
            await auctionQueries.playerRegistrationAuction(data.auctionId);
        if (playerInformation.length) {
            const auctionInfo = playerInformation[0];
            const preRegisterRefund: Array<{
                created_by: string;
                play_credit: number;
                spend_on: Ispend_on;
                auction_id: string;
            }> = [];
            const userEmail = playerInformation.map((player) => {
                preRegisterRefund.push({
                    created_by: player.player_id,
                    play_credit: player.Auctions?.registeration_fees as number,
                    spend_on: Ispend_on.REFUND_PLAYS,
                    auction_id: data.auctionId,
                });
                return player.User.email;
            });
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
                    message: `${auctionInfo?.Auctions?.title} has been cancelled and your ${preRegisterRefund[0]?.play_credit} plays have refunded `,
                };
                await mailService(data);
                await userQueries.addPlayRefundBalanceTx([
                    ...preRegisterRefund,
                ]);
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
    NODE_EVENT_SERVICE.AUCTION_STATE_UPDATE,
    async function (data: { auctionId: string; state: auctionState }) {
        await auctionQueries.updateAuctionState(data.auctionId, data.state);
    }
);
eventService.on(NODE_EVENT_SERVICE.UPDATE_PLAYER_REGISTER_STATUS,async(auction_id:string)=>{
    await auctionQueries.updatePlayerRegistrationAuctionStatus(auction_id,"live");
})

eventService.on(
    NODE_EVENT_SERVICE.AUCTION_CLOSED,
    async (auctionId: string) => {
        const auctionBidLog = await redisClient.get(`${auctionId}:bidHistory`);
        if (auctionBidLog) {
            const winnerePayload = JSON.parse(auctionBidLog);
            await userQueries.playerBidLog(winnerePayload);
            const newWinnerPayload = winnerePayload[winnerePayload.length - 1];
            await auctionQueries.updatePlayerRegistrationAuctionResultStatus(auctionId,newWinnerPayload.player_id)            
        }
    }
);

eventService.on(
    NODE_EVENT_SERVICE.AUCTION_REGISTER_COUNT,
    async (data: { auctionId: string; registeration_count: number }) => {

        const auctionData = await auctionQueries.auctionRegistrationCount(
            data.auctionId);
            console.log(data,auctionData);
            
        socket.playerSocket.emit(SOCKET_EVENT.AUCTION_REGISTER_COUNT, {
            message: MESSAGES.SOCKET.TOTAL_AUCTION_REGISTERED,
            data: {
                auction_registration_percentage:(auctionData*100)/data.registeration_count,
                auctionId: data.auctionId,
            },
        });
    }
);

export default eventService;
