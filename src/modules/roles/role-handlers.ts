import { Request, Response } from "express"
import roleService from "./role-services"

const fetchRole = async (req: Request, res: Response) => {
    const response = await roleService.fetchRole(req.params)
    res.status(response.code).json(response)
}

const createNewRole = async (req: Request, res: Response) => {
    const response = await roleService.AddNewRole(req.body)
    res.status(response.code).json(response)
}
const fetchAllRoles = async (req: Request, res: Response) =>{
    const response = await roleService.fetchAllRoles(req.body)
    res.status(response.code).json(response)
}
const roleHandlers = {
    fetchRole,
    createNewRole,
    fetchAllRoles
}
export default roleHandlers