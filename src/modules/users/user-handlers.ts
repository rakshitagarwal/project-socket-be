import { Request, Response } from "express";
import userService from "./user-services";
import { IplayerTransactionHistory, IuserPagination } from "./typings/user-types";
/**
 * @description handles admin  or player registration
 * @param req { Request } - admin  or player's request object
 * @param res { Response }
 */

const register = async (req: Request, res: Response) => {
    const response = await userService.register(req.body);
    res.status(response.code).json(response);
};
/**
 * @description handles patch request for email verfication or login verfication
 * @param req { Request } admin or player's request object
 * @param res { Response } admin or player's request's response object
 */

const otpVerification = async (req: Request, res: Response) => {
    const response = await userService.otpVerifcation({
        ...req.body,
        user_agent: req.useragent?.source,
        ip_address: req.ip,
    });
    res.status(response.code).json(response);
};

/**
 * @description handles post request for login admin
 * @param req { Request } admin request object
 * @param res { Response } admin request's response object
 */

const adminLogin = async (req: Request, res: Response) => {
    const response = await userService.adminLogin({
        ...req.body,
        user_agent: req.useragent?.source,
        ip_address: req.ip,
    });
    res.status(response.code).json(response);
};

/**
 * @description handles post request for login player's
 * @param req { Request } player's request object
 * @param res { Response } player's request's response object
 */

const playerLogin = async (req: Request, res: Response) => {
    const response = await userService.playerLogin({
        ...req.body,
        user_agent: req.useragent?.source,
        ip_address: req.ip,
    });
    res.status(response.code).json(response);
};
/**
 * @description This API logout current admin  or player to used.
 * @param req { Request } - admin or player's request object
 * @param res { Response }
 */
const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader.split(" ")[1];
    const response = await userService.logout({ access_token: token });
    res.status(response.code).json(response);
};

/**
 * @description handles specific user details
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const getUserDetail = async (req: Request, res: Response) => {
    const response = await userService.getUser(req.params);
    res.status(response.code).json(response);
};

/**
 * @description handles  user update data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
const updateUser = async (req: Request, res: Response) => {
    const response = await userService.updateUser(req.params, req.body);
    res.status(response.code).json(response);
};

/**
 * @description handle user refresh token request
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const refreshToken = async (req: Request, res: Response) => {
    const response = await userService.refreshToken({
        ...req.body,
        user_agent: req.useragent?.source,
        ip_address: req.ip,
    });
    res.status(response.code).json(response);
};

/**
 * @description handles specific user details
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const removeUser = async (req: Request, res: Response) => {
    const response = await userService.deleteUser(req.params);
    res.status(response.code).json(response);
};

/**
 * @description this API forget a email for admin
 * @param req { Request } - request object
 * @param res { Response }
 */

const forgetPassword = async (req: Request, res: Response) => {
    const response = await userService.forgetPassword(req.body);
    res.status(response.code).json(response);
};

/**
 * @description this API is used to update a user's password
 * @param req { Request } - request object
 * @param res { Response }
 */

const updatePassword = async (req: Request, res: Response) => {
    const response = await userService.updatePassword(req.body);
    res.status(response.code).json(response);
};

/**
 * @description This API set a password for admin
 * @param req { Request } - request object
 * @param res { Response }
 */

const resetPassword = async (req: Request, res: Response) => {
    const response = await userService.resetPassword(req.body);
    res.status(response.code).json(response);
};

/**
 * @description This API fetch all player records
 * @param req { Request } - request object
 * @param res { Response }
 */

const getAllusers = async (req: Request, res: Response) => {    
    const response = await userService.fetchAllUsers(
        req.query as unknown as IuserPagination
    );
    res.status(response.code).json(
        JSON.parse(
            JSON.stringify(response, (_key, value) =>
                typeof value === "bigint" ? +value.toString() : value
            )
        )
    );
};

/**
 * @description add the plays in the wallet
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

const addPlaysInWallet = async (req: Request, res: Response) => {
    const response = await userService.addWalletTransaction(req.body);
    res.status(response.code).json(response);
};

/**
 * @description GET player play balance
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
const getPlayBalance = async (req: Request, res: Response) => {
    const response = await userService.getPlayerWalletBalance(
        req.params.id as string
    );
    res.status(response.code).json(
        JSON.parse(
            JSON.stringify(response, (_key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        )
    );
};

/**
 * @description POST deduct play balances for player id
 * @param {Request} req
 * @param {Response} res
 */
const deductPlays = async (req: Request, res: Response) => {
    const response = await userService.debitPlaysForPlayer(req.body);
    res.status(response.code).json(response);
};

/**
 * @description transferPlays is to transfer plays from one user to other user
 * @param {Request} req
 * @param {Response} res
 */
const transferPlays = async (req: Request, res: Response) => {
    const response = await userService.transferPlays(req.body);
    res.status(response.code).json(response);
};

/**
 * @description verifyUserDetails is to verify if user exists
 * @param {Request} req
 * @param {Response} res
 */
const verifyUserDetails = async (req: Request, res: Response) => {
    const response = await userService.verifyUserDetails(req.body);
    res.status(response.code).json(response);
};

/**
 * Resends an OTP (One-Time Password) to a user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves with the response JSON.
 */
const resendOtpToUser = async (req: Request, res: Response) => {
    const response = await userService.resendOtpToUser(req.body);
    res.status(response.code).json(response);
};


/**
 * @description handles patch request for  player block 
 * @param req { Request } admin or player's request object
 * @param res { Response } admin or player's request's response object
 */

const userBlockStatus = async (req: Request, res: Response) => {
    const response = await userService.userBlockStatus(req.params.id as string, req.body);
    res.status(response.code).json(response);
};

/**
 * @description handles get request for  player transaction history 
 * @param req { Request } admin or player's request object
 * @param res { Response } admin or player's request's response object
 */

const playerTransactionHistory = async (req: Request, res: Response) => {
    const response = await userService.playerTransactionHistory(req.params.id as string ,req.query as unknown as IplayerTransactionHistory );
    res.status(response.code).json(
        JSON.parse(
            JSON.stringify(response, (_key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        )
    );
};

/**
 * Controller function to handle the retrieval of player images.
 * @param {Object} _req - Express Request object (not used in this function).
 * @param {Object} res - Express Response object to send the HTTP response.
 * @returns {void}
 * @throws {Error} If there is an error during the image retrieval process.
 *
 */

const getPlayerImages=async (_req: Request, res: Response) => {
    const response = await userService.playerImages();
    res.status(response.code).json(response);
};

const userHandlers = {
    register,
    otpVerification,
    adminLogin,
    playerLogin,
    logout,
    getUserDetail,
    updateUser,
    refreshToken,
    removeUser,
    forgetPassword,
    updatePassword,
    resetPassword,
    getAllusers,
    addPlaysInWallet,
    getPlayBalance,
    deductPlays,
    verifyUserDetails,
    transferPlays,
    resendOtpToUser,
    userBlockStatus,
    playerTransactionHistory,
    getPlayerImages
};

export default userHandlers;
