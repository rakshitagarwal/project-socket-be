import { verifyJwtToken, createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";

/**
 * verify JWT_TOKEN from headers
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns Object
 */
export const isAuthenticated = (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    {
      message: helpers.StatusMessages.UNAUTHORIZED,
    }
  );

  if (!req.headers.authorization?.includes(" ")) {
    res.status(statusCode).json(response);
    return;
  }

  const [type, jwtToken] = req.headers.authorization.split(" ");
  if (!token || type !== "Bearer") {
    res.status(statusCode).json(response);
    return;
  }

  const userData = verifyJwtToken(jwtToken);
  res.locals = userData;
  next();
};
