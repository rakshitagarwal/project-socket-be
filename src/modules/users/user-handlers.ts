
import { Request, Response } from "express"
import userService from "./user-services"
import { IuserPagination } from "./typings/user-types"
/**
 * @description handles admin  or player registration
 * @param req { Request } - admin  or player's request object
 * @param res { Response }
 */

const register = async (req: Request, res: Response) => {
    const response = await userService.register(req.body)
    res.status(response.code).json(response)
}
/**
 * @description handles patch request for email verfication or login verfication
 * @param req { Request } admin or player's request object
 * @param res { Response } admin or player's request's response object
 */

const otpVerification = async (req: Request, res: Response) => {
    const response = await userService.otpVerifcation({ ...req.body, user_agent: req.useragent?.source, ip_address: req.ip })
    res.status(response.code).json(response)
}

/**
 * @description handles post request for login admin
 * @param req { Request } admin request object
 * @param res { Response } admin request's response object
 */

const adminLogin = async (req: Request, res: Response) => {
    const response = await userService.adminLogin({ ...req.body, user_agent: req.useragent?.source, ip_address: req.ip })
    res.status(response.code).json(response)
}

/**
 * @description handles post request for login player's
 * @param req { Request } player's request object
 * @param res { Response } player's request's response object
 */

const playerLogin = async (req: Request, res: Response) => {
    const response = await userService.playerLogin({ ...req.body, user_agent: req.useragent?.source, ip_address: req.ip })
    res.status(response.code).json(response)
}
/**
 * @description This API logout current admin  or player to used.
 * @param req { Request } - admin or player's request object
 * @param res { Response }
 */
const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader.split(" ")[1];
    const response = await userService.logout({ access_token: token })
    res.status(response.code).json(response)
}

/**
 * @description handles specific user details
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const getUserDetail = async (req: Request, res: Response) => {
    const response = await userService.getUser(req.params)
    res.status(response.code).json(response)
}

/**
 * @description handles  user update data
 * @param req { Request } - user's request object
 * @param res { Response }
 */
const updateUser = async (req: Request, res: Response) => {
    const response = await userService.updateUser(req.params, req.body);
    res.status(response.code).json(response)
}

/**
 * @description handle user refresh token request
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const refreshToken = async (req: Request, res: Response) => {
    const response = await userService.refreshToken({ ...req.body, user_agent: req.useragent?.source, ip_address: req.ip })
    res.status(response.code).json(response)
}

/**
 * @description handles specific user details
 * @param req { Request } - user's request object
 * @param res { Response }
 */

const removeUser = async (req: Request, res: Response) => {
    const response = await userService.deleteUser(req.params)
    res.status(response.code).json(response)
}


/**
 * @description this API forget a email for admin
 * @param req { Request } - request object
 * @param res { Response }
 */

const forgetPassword = async (req: Request, res: Response) => {
    const response = await userService.forgetPassword(req.body)
    res.status(response.code).json(response)
}

/**
 * @description this API is used to update a user's password
 * @param req { Request } - request object
 * @param res { Response }
 */

const updatePassword = async (req: Request, res: Response) => {
    const response = await userService.updatePassword(req.body)
    res.status(response.code).json(response)
}

/**
 * @description This API set a password for admin 
 * @param req { Request } - request object
 * @param res { Response }
 */

const resetPassword = async (req: Request, res: Response) => {
    const response = await userService.resetPassword(req.body)
    res.status(response.code).json(response)
}

/**
 * @description This API fetch all player records
 * @param req { Request } - request object
 * @param res { Response }
 */

const getAllusers = async (req: Request, res: Response) => {
    const response = await userService.fetchAllUsers(req.query as unknown as IuserPagination)
    res.status(response.code).json(response)
}
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
    getAllusers
}

export default userHandlers