import { EventEmitter } from "events";
import { Imail, mailService } from "./mail-service"
const eventService: EventEmitter = new EventEmitter();

eventService.on('send-user-mail', async function (data: Imail) {
    await mailService(data)
})

export default eventService