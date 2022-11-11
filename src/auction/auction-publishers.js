import { EventEmitter } from "node:events";
import v1Socket from "../../server.js";
import logger from "../config/logger.js";
import { activeAuction, createBidLog, putAuction } from "./auction-queries.js";

let currentAuction;

const BID_TIMEOUT = 10000; // 10 seconds bidTimeOut

const PLAY_BALANCE = 1000; // 1000 plays for each user

let TIMEOUT;

const auctionChecker = new EventEmitter();

export const auctionStatus = ({ status, message }) => {
  v1Socket.emit("auction:status", {
    status,
    message,
  });
};

auctionChecker.on("auction:start", async function (data) {
  try {
    const updateAuction = { ...data, state: "Publish" };
    currentAuction = await putAuction(updateAuction["_id"], updateAuction);
    if (!currentAuction) {
      logger.info({
        type: "Auction",
        action: "Auction Can't Updated",
      });
      auctionStatus({ status: false, message: "auction not updated" });
    } else {
      logger.info({
        type: "Auction",
        action: "Auction Updated",
      });
      auctionStatus({ status: true, message: "auction updated" });
    }
  } catch (err) {
    console.log(err);
    auctionStatus({
      status: false,
      message: err.message,
    });
  }
});

// for chekcing the newBidRecieved or not
// payload -> userid, auctionID, auction_price, plays_consumed, current_timestamp
export const newBidRecieved = async ({ payload, isBot = false }) => {
  try {
    if (!isBot) {
      if (!currentAuction) return;

      // validate the payload using the JOI schemas
      let userPlayBalance = PLAY_BALANCE;

      if (userPlayBalance <= 0)
        auctionStatus({
          status: false,
          message: "Your PlayBalance is not enough",
        });

      logger.info({ type: "auction", action: "bid", isBot: `${isBot}` });

      userPlayBalance -= plays_consumed;

      const publishData = {
        ...payload,
        currentTimeStamp: new Date(),
        userPlayBalance,
      };

      v1Socket.emit("bid:publish", publishData);

      // update the user playBalance in database

      //  update the auction Opening Price

      // create Bid-log
      await createBidLog({
        payload: publishData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const startAuction = async () => {
  try {
    const auctions = await activeAuction();
    for (let i = 0; i < auctions.length; i++) {
      const auctionStartDt = new Date(auctions[i].startDate).getTime();
      let auctionCreateDT = new Date(auctions[i].createdAt).getTime();
      let nowDateTime = new Date().toUTCString();
      let newTime = new Date(nowDateTime).getTime();
      let diff = auctionStartDt - auctionCreateDT;

      if (newTime > auctionStartDt) {
        auctionCreateDT = nowDateTime;
        diff = auctionStartDt - auctionCreateDT;
        setTimeout(function () {
          console.log("inside the settimout");
          logger.info({
            type: "Auction",
            action: "Auction started",
            startedAt: auctions[i].startDate,
          });

          auctionChecker.emit("auction:start", auctions[i]);
        }, diff);

        console.log("auction started...");
      } else {
        console.log("auction startingg...");
      }
    }
  } catch (err) {
    console.log(err);
    auctionStatus({
      status: false,
      message: err.message,
    });
  }
};
