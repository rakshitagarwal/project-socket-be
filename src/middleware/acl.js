import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { calculatePrivilages } from "./../common/utilies.js";
import { getRoleById, getPrivilagesForRole } from "./../roles/role-queries.js";

export const checkAccess = async (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    {
      message: helpers.StatusMessages.UNAUTHORIZED,
    }
  );

  // TODO: add roleid from jwt auth

  const role = await getRoleById("Admin");
  if (!role) {
    res.status(statusCode).json(response);
  }
  const { module } = await getPrivilagesForRole(role._id);

  const moduleName = req._parsedUrl.pathname.split("/")[1];
  const requestedModule = module.find((m) => moduleName.indexOf(m.name) != -1);

  if (requestedModule) {
    const methodsToAccess = calculatePrivilages(
      requestedModule.privilageNumber
    );
    const hasAccess = methodsToAccess.find((method) =>
      method.includes(req.method) ? true : false
    );
    if (hasAccess) {
      next();
    } else {
      res.status(statusCode).json(response);
    }
  } else {
    res.status(statusCode).json(response);
  }
};
