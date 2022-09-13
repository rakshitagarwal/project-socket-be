import { checkCredentials } from "./user-services.js";
export const login = async function (req, res) {
    const { statusCode, response } = await checkCredentials(req.body);
    res.status(statusCode).json(response);
}