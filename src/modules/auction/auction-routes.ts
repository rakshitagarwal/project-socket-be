import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import handleAsync from "express-async-handler";
import { auctionHandler } from "./auction-handlers";
import isAuthenticated from "../../middlewares/authentication";

export const auctionRouter = Router();

auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_LISTING,
    [validateRequest.query(auctionSchemas.ZAuctionListing)],
    handleAsync(auctionHandler.auctionListing)
);

auctionRouter.post(
    ENDPOINTS.BASE,
    [isAuthenticated,validateRequest.body(auctionSchemas.ZAuctionAdd)],
    handleAsync(auctionHandler.create)
);

auctionRouter.get(
    ENDPOINTS.ID,
    [isAuthenticated,validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.getById)
);

auctionRouter.get(
    ENDPOINTS.BASE,
    [isAuthenticated,validateRequest.query(auctionSchemas.Zpagination)],
    handleAsync(auctionHandler.getAll)
);

auctionRouter.put(
    ENDPOINTS.ID,
    [
        isAuthenticated,
        validateRequest.params(auctionSchemas.ZAuctionId),
        validateRequest.body(auctionSchemas.ZAuctionUpdate),
    ],
    handleAsync(auctionHandler.update)
);

// auctionRouter.delete(
//     ENDPOINTS.BASE,
//     validateRequest.body(auctionSchemas.ZDeleteId),
//     handleAsync(auctionHandler.remove)
// );

auctionRouter.get(
    ENDPOINTS.BASE + "logs/:id",
    [isAuthenticated,validateRequest.params(auctionSchemas.ZAuctionId),
    validateRequest.query(auctionSchemas.ZPlayerAuction)],
    handleAsync(auctionHandler.getBidLogs)
);

auctionRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.PLAYER_AUCTION_REGISTER,
    [isAuthenticated,validateRequest.body(auctionSchemas.ZPlayerRegister)],
    handleAsync(auctionHandler.playerAuctionRegister)
);

auctionRouter.post(
    ENDPOINTS.BASE + "start",
    [isAuthenticated,validateRequest.body(auctionSchemas.ZStartAuction)],
    handleAsync(auctionHandler.startAuction)
);
auctionRouter.get(
    ENDPOINTS.PLAYER_AUCTION_ID,
    [
        isAuthenticated,
        validateRequest.params(auctionSchemas.ZAuctionId),
        validateRequest.query(auctionSchemas.ZPlayerAuction),
    ],
    handleAsync(auctionHandler.getAllMyAuction)
);

auctionRouter.get(
    ENDPOINTS.PLAYER_AUCTION,
    [isAuthenticated,validateRequest.query(auctionSchemas.IPlayerAuction)],
    handleAsync(auctionHandler.playerAuctionDetails)
);

auctionRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.PAY_NOW,
    [isAuthenticated,validateRequest.body(auctionSchemas.ZPlayerWinner)],
    handleAsync(auctionHandler.purchase)
);

auctionRouter.post(
    ENDPOINTS.BASE + "start/simulation",
    [isAuthenticated,validateRequest.body(auctionSchemas.ZSimulation)],
    handleAsync(auctionHandler.startSimulation)
);


auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL_LIST,
    [isAuthenticated,validateRequest.query(auctionSchemas.ZAuctionTotalListing)],
    handleAsync(auctionHandler.auctionListingTotal)
);
auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL_LIST +  ENDPOINTS.ID,
    [isAuthenticated,validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.getByIdTotalAuction)
);
auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL,
    [isAuthenticated],
    handleAsync(auctionHandler.auctionTotal)
);

auctionRouter.get(
    ENDPOINTS.GRID_LIVE_UPCOMING,
    [validateRequest.query(auctionSchemas.Zpagination)],
    handleAsync(auctionHandler.getAllAuctionforGrid)
);

auctionRouter.patch(
    ENDPOINTS.CANCEL + ENDPOINTS.ID,
    [isAuthenticated,validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.cancelAuction)
);
