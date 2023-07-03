import termAndConditionService from "./term-condition-services"
import { Request, Response } from "express"
import { Ipagination } from "./typings/term-condition-types"
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
 * @description handle to  update specifice request
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */

const update = async (req: Request, res: Response) => {
    const response = await termAndConditionService.update(req.params, req.body)
    res.status(response.code).json(response)
}

/**
 * @description handle to delete specifice request
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */
const deleteById = async (req: Request, res: Response) => {
    const response = await termAndConditionService.deleteOne(req.params)
    res.status(response.code).json(response)
}

/**
 * @description handle to fetch specifice request
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */
const getById = async (req: Request, res: Response) => {
    const response = await termAndConditionService.fetchOne(req.params)
    res.status(response.code).json(response)
}

/**
 * @description handle to fetch all term and condition
 * @param req { Request } - term and condition request object
 * @param res { Response }
 */

const getAllTermAndCondition = async (req: Request, res: Response) => {
    const response = await termAndConditionService.fetchAll(req.query as unknown as Ipagination)
    res.status(response.code).json(response)
}

const termAndConditionHandlers = {
    create,
    update,
    deleteById,
    getById,
    getAllTermAndCondition
}
export default termAndConditionHandlers