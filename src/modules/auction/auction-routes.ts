import { Router } from "express";
import { ENDPOINTS } from "../../common/constants";
import validateRequest from "../../middlewares/validateRequest";
import { auctionSchemas } from "./auction-schemas";
import handleAsync from "express-async-handler";
import { auctionHandler } from "./auction-handlers";

export const auctionRouter = Router();

auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_LISTING,
    [validateRequest.query(auctionSchemas.ZAuctionListing)],
    handleAsync(auctionHandler.auctionListing)
);

auctionRouter.post(
    ENDPOINTS.BASE,
    [validateRequest.body(auctionSchemas.ZAuctionAdd)],
    handleAsync(auctionHandler.create)
);

auctionRouter.get(
    ENDPOINTS.ID,
    [validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.getById)
);

auctionRouter.get(
    ENDPOINTS.BASE,
    [validateRequest.query(auctionSchemas.Zpagination)],
    handleAsync(auctionHandler.getAll)
);

auctionRouter.put(
    ENDPOINTS.ID,
    [
        
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
    [validateRequest.params(auctionSchemas.ZAuctionId),
    validateRequest.query(auctionSchemas.ZPlayerAuction)],
    handleAsync(auctionHandler.getBidLogs)
);

auctionRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.PLAYER_AUCTION_REGISTER,
    [validateRequest.body(auctionSchemas.ZPlayerRegister)],
    handleAsync(auctionHandler.playerAuctionRegister)
);

auctionRouter.post(
    ENDPOINTS.BASE + "start",
    [validateRequest.body(auctionSchemas.ZStartAuction)],
    handleAsync(auctionHandler.startAuction)
);
auctionRouter.get(
    ENDPOINTS.PLAYER_AUCTION_ID,
    [
        
        validateRequest.params(auctionSchemas.ZAuctionId),
        validateRequest.query(auctionSchemas.ZPlayerAuction),
    ],
    handleAsync(auctionHandler.getAllMyAuction)
);

auctionRouter.get(
    ENDPOINTS.PLAYER_AUCTION,
    [validateRequest.query(auctionSchemas.IPlayerAuction)],
    handleAsync(auctionHandler.playerAuctionDetails)
);

auctionRouter.post(
    ENDPOINTS.BASE + ENDPOINTS.PAY_NOW,
    [validateRequest.body(auctionSchemas.ZPlayerWinner)],
    handleAsync(auctionHandler.purchase)
);

auctionRouter.post(
    ENDPOINTS.BASE + "start/simulation",
    [validateRequest.body(auctionSchemas.ZSimulation)],
    handleAsync(auctionHandler.startSimulation)
);


auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL_LIST,
    [validateRequest.query(auctionSchemas.ZAuctionTotalListing)],
    handleAsync(auctionHandler.auctionListingTotal)
);
auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL_LIST +  ENDPOINTS.ID,
    [validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.getByIdTotalAuction)
);
auctionRouter.get(
    ENDPOINTS.BASE + ENDPOINTS.AUCTION_TOTAL,
    handleAsync(auctionHandler.auctionTotal)
);

auctionRouter.get(
    ENDPOINTS.GRID_LIVE_UPCOMING,
    [validateRequest.query(auctionSchemas.Zpagination)],
    handleAsync(auctionHandler.getAllAuctionforGrid)
);

auctionRouter.patch(
    ENDPOINTS.CANCEL + ENDPOINTS.ID,
    [validateRequest.params(auctionSchemas.ZAuctionId)],
    handleAsync(auctionHandler.cancelAuction)
);
