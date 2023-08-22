import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import handleAsync from "express-async-handler";

export const referralRouter = Router();

referralRouter.get("get");
referralRouter.post("post");
referralRouter.put("put");
referralRouter.delete("delete");