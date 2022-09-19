import mongoose from "mongoose";
import { model } from "../common/dbSchema.js";

const walletSchema = mongoose.model("Wallet", model.walletSchema);
const transactionSchema = mongoose.model(
  "transaction",
  model.transactionSchema
);

export const walletRole = {
  walletSchema,
  transactionSchema,
};
