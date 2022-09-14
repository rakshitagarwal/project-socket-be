import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import { calculatePrivilages } from "./../common/utilies.js";
import { getPrivilagesForRole } from "./../roles/role-queries.js";

export const checkAccess = async (req, res, next) => {
  const { statusCode, response } = createResponse(
    helpers.StatusCodes.UNAUTHORIZED,
    {
      message: helpers.StatusMessages.UNAUTHORIZED,
    }
  );
  // TODO: add roleid from jwt auth 
  const { module } = await getPrivilagesForRole("63215df22a813f616e9ba177");
  const moduleName = req._parsedUrl.pathname.split("/")[1];
  const requestedModule = module.find(m => moduleName.indexOf(m.name) != -1);
  if(requestedModule) {
    const methodsToAccess = calculatePrivilages(requestedModule[0].privilageNumber);
    const hasAccess = methodsToAccess.find(method => method.includes(req.method) ? true : false);
    if(hasAccess) {
      // TODO: proceed
    } else {
      // TODO: Unauthorized
    }
  } else {
    // TODO: Unauthorized
  }
};
