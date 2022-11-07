import { Router } from "express";
import { addSettings } from "./setting-handlers.js";

export const settingRouter = Router();

settingRouter.post("/", addSettings);
