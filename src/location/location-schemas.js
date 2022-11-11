import mongoose from "mongoose";
import { country } from "../common/dbSchema.js";

export const CountryModel = mongoose.model("Country", country);
