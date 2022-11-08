import { model } from "../common/dbSchema.js";
import mongoose from "mongoose";

export const settingModel = new mongoose.model("Settings", model.settings);
