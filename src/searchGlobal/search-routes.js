import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";

import { searchGlobal } from "./search-handlers.js";

export const searchRouter = Router();
searchRouter.get("/", isAuthenticated, searchGlobal);
