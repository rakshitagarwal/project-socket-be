import { EventEmitter } from "events";
import { mailService } from "./mail-service"
import {Imail} from "./typing/utils-types"
const eventService: EventEmitter = new EventEmitter();

/**
 * @description - this event use for sending email notifications
 */
eventService.on('send-user-mail', async function (data: Imail) {
    await mailService(data)
})

export default eventService