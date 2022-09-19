import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const auctionCategory = mongoose.model(
  "AuctionCategory",
  model.auctionCategory
);

const auctionSchema = mongoose.model("Auction", model.auctionSchema);
const auctionPreRegister = mongoose.model(
  "auctionPreRegister",
  model.auctionPreRegisterSchema
);
const auctionResultSchema = mongoose.model(
  "AuctionResult",
  model.auctionResultSchema
);

export const auctionRole = {
  auctionCategory,
  auctionSchema,
  auctionPreRegister,
  auctionResultSchema,
};
