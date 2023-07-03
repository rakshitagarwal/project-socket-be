import termAndConditionService from "./term-condition-services"
import { Request, Response } from "express"

/**
 * @description handles new terms and conditions  requests 
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */
const create = async (req: Request, res: Response) => {
    const response = await termAndConditionService.create({ ...req.body, created_by: res.locals.id as string })
    res.status(response.code).json(response)
}


/**
 * @description handle to update update specifice request
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */

const update = async (req: Request, res: Response) => {
    const response = await termAndConditionService.update(req.params, req.body)
    res.status(response.code).json(response)
}

const termAndConditionHandlers = {
    create,
    update
}
export default termAndConditionHandlers