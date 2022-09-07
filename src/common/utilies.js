import { helpers } from "../helper/helpers.js";

export const createResponse = (statusCode, data) => {
  const success = statusCode < helpers.StatusCodes.BAD_REQUEST;
  if (success) {
    const response = { success: success, data: data };
    return { statusCode, response };
  }
  const response = { success: success, error: data };
  return { statusCode, response };
};
