import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

export const auctionModel = mongoose.model("Auction", model.auctionSchema);

const auctionCategory = mongoose.model(
  "AuctionCategory",
  model.auctionCategory
);

export const auctionRole = { auctionCategory };
