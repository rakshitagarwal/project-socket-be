import { EventEmitter } from "events";
import { Imail, mailService } from "./mail-service"
const eventService: EventEmitter = new EventEmitter();

/**
 * @description - this event use for sending email notifications
 */
eventService.on('send-user-mail', async function (data: Imail) {
    await mailService(data)
})

export default eventService