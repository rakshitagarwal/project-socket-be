
import { Request, Response } from "express"
import userService from "./user-services"

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


const userHandlers = {
    register,
    otpVerification,
    adminLogin,
    playerLogin,
    logout
}

export default userHandlers