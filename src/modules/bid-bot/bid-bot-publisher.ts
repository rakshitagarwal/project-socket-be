import { AppGlobal } from "../../utils/socket-service";
import redisClient from "../../config/redis";
import userQueries from "../users/user-queries";
import { NODE_EVENT_SERVICE, SOCKET_EVENT } from "../../common/constants";
import bidBotQueries from "./bid-bot-queries";
import { IBidBotData } from "./typings/bid-bot-types";
import bidBotService from "./bid-bot-services";
import { newBiDRecieved } from "../auction/auction-publisher";
import seedrandom from "seedrandom";
import eventService from "../../utils/event-service";
const socket = global as unknown as AppGlobal;

// export const selectRandomBidClient = async function selectRandomBidClient(auction_id: string) {
// };

let timer:number;
eventService.on(NODE_EVENT_SERVICE.COUNTDOWN, async function (countdown: number,auctionId: string) {
    timer = countdown;
    console.log(auctionId, "auctionId");
});

export const executeBidbot = async function (
    botData: IBidBotData,
    bidBotId: string,
    socketId: string
) {
    const playsProvided = Number(await redisClient.get(`BidBotCount:${botData.player_id}:${botData.auction_id}`));

    if (playsProvided <= 0) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "plays limit reached"});
        return;
    }

    let randomClient = null;
    const bidBotCollection = await bidBotQueries.bidBotCollection(botData.auction_id);
    if (bidBotCollection.length > 0)
    randomClient = bidBotCollection[Math.floor(Math.random() * bidBotCollection.length)];

    const bidHistory = JSON.parse((await redisClient.get(`${botData.auction_id}:bidHistory`)) as string);

    if (bidHistory && bidHistory[bidHistory.length - 1]?.player_id === randomClient?.player_id) {
        randomClient = bidBotCollection[Math.floor(Math.random() * bidBotCollection.length)];
    }

    // const randomTime = Math.floor(Math.random() * 5) + 1;

    const rng = seedrandom();
    const randomNumber = rng();
    const randomTime: number = Math.floor((randomNumber as unknown as number) * 5) + 1;
    console.log(randomTime, "randomTime");

    console.log(timer, "countdown passed");
    if (timer === randomTime) {
        console.log(timer, "countdown");
        console.log(botData.auction_id, "auction id");      
        newBiDRecieved(
            {
                player_id: botData.player_id,
                auction_id: botData.auction_id,
                player_name: botData.player_name,
                profile_image: botData.profile_image,
                remaining_seconds: timer as number,
                player_bot_id: randomClient?.id,
            },
            socketId
        );

        const auctionRunning = JSON.parse((await redisClient.get(`auction:live:${botData.auction_id}`)) as string);
        const playsUpdated = (playsProvided - auctionRunning.plays_consumed_on_bid) as number;
        await redisClient.set(`BidBotCount:${botData.player_id}:${botData.auction_id}`,`${playsUpdated}`);
    }

    const isActive = timer;
    if (!isActive) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "auction not active"});
    } else {
        executeBidbot(botData, bidBotId, socketId);
    }
};

export const bidByBotRecieved = async (
    botData: IBidBotData,
    socketId: string
) => {

    const wallet = await userQueries.playerWalletBac(botData.player_id);
    if ((wallet?.play_balance as number) < botData.plays_limit) {
        socket.playerSocket.to(socketId).emit(SOCKET_EVENT.AUCTION_ERROR, {message: "wallet balance insufficient"});
        return;
    }

    const data = await redisClient.get(`BidBotCount:${botData.player_id}:${botData.auction_id}`);
    const existBot = await bidBotQueries.getByAuctionAndPlayerId(botData.player_id,botData.auction_id);

    let insertBidBot = null;
    if (!existBot) {
        insertBidBot = await bidBotService.addBidBot(botData);
    }

    if (!data?.length) {
        await redisClient.set(`BidBotCount:${botData.player_id}:${botData.auction_id}`,`${botData.plays_limit}`);
    }

    executeBidbot(botData, insertBidBot as string, socketId);
};
