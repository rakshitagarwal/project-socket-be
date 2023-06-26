
import { Request, Response } from "express"
import userService from "./user-services"

const register = async (req: Request, res: Response) => {
    const response = await userService.register(req.body)    
    res.status(response.code).json(response)
}

const userHandlers = {
    register
}
export default userHandlers