import { Request, Response } from "express"
import roleService from "./role-services"
import { IrolePagination } from "./typings/role-types"

/**
 * @description get the specified role
 * @param req { Request } - request object contain the role title
 * @param res { Response }
 */

const fetchRole = async (req: Request, res: Response) => {
    const response = await roleService.fetchRole(req.params)
    res.status(response.code).json(response)
}

/**
 * @description create a new role
 * @param req { Request } - request object containing the body data
 * @param res { Response }
 */

const createNewRole = async (req: Request, res: Response) => {
    const response = await roleService.AddNewRole(req.body)
    res.status(response.code).json(response)
}
/**
 * @description get list of roles
 * @param req { Request } - request object containing roles pagination information
 * @param res { Response }
 */

const fetchAllRoles = async (req: Request, res: Response) =>{
    const response = await roleService.fetchAllRoles(req.query as unknown as IrolePagination)
    res.status(response.code).json(response)
}
const roleHandlers = {
    fetchRole,
    createNewRole,
    fetchAllRoles
}
export default roleHandlers