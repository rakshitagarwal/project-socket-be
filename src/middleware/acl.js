import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { calculatePrivilages } from "./../common/utilies.js";
import { getPrivilagesForRole } from "./../roles/role-queries.js";

export const checkAccess = async (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    helpers.StatusMessages.UNAUTHORIZED
  );
  let moduleName = req.baseUrl.split("/")[2];
  moduleName.indexOf("users") != -1 ? (moduleName = "vendors") : null;
  const { module: modules } = await getPrivilagesForRole(res.locals.Role._id);
  const requestedModule = modules.find((m) => moduleName.indexOf(m.name) != -1);
  if (requestedModule) {
    const methodsToAccess = calculatePrivilages(
      requestedModule.privilageNumber
    );
    if (methodsToAccess.includes(req.method)) {
      next();
    } else {
      res.status(statusCode).json(response);
      // TO-DO: do not have access
    }
  } else {
    // TO-DO: do not have access
    res.status(statusCode).json(response);
  }
};

export const userAccess = async (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    helpers.StatusMessages.UNAUTHORIZED
  );
};
