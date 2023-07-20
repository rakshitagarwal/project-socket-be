import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis"
const socket = global as unknown as AppGlobal;
const countdowns: { [auctionId: string]: number } = {}; // Countdown collection

export const auctionStart = (auctionId: string) => {
    countdowns[auctionId] = 10;
        async function timerRunEverySecond() {
        if ((countdowns[auctionId] as number) <= 0) {
            const bidHistory= JSON.parse(await redisClient.get(`${auctionId}:bidHistory`) as unknown as string)
            const winnerPlayer=bidHistory[bidHistory.length-1]
            delete countdowns[auctionId];
            socket.playerSocket.emit("auction:",{message:"auction winner!",...winnerPlayer})
        } else {
            socket.playerSocket.emit("auction:count-down", {count: countdowns[auctionId],auctionId});
            countdowns[auctionId] = (countdowns[auctionId] as number) - 1;
            setTimeout(timerRunEverySecond, 1000);
        }
    }
    timerRunEverySecond();
};

