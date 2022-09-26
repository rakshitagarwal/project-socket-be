import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

export const auctionModel = mongoose.model("Auction", model.auctionSchema);
export const auctionPreModel = mongoose.model(
  "AuctionPreRegister",
  model.auctionPreRegisterSchema
);
export const auctionPostModel = mongoose.model(
  "AuctionPostRegister",
  model.auctionPostRegisterSchema
);
const auctionCategory = mongoose.model(
  "AuctionCategory",
  model.auctionCategory
);

export const auctionRole = { auctionCategory };
