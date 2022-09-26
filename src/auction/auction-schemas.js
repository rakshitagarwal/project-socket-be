import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const auctionCategory = mongoose.model(
  "AuctionCategory",
  model.auctionCategory
);

export const auctionRole = { auctionCategory };
