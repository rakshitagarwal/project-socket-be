import StatusCodes from "./statusCodes.js";

const createResponse = (statusCode, data) => {
  const success = statusCode < StatusCodes.BAD_REQUEST;
  if (success) {
    const response = { success: success, data: data };
    return { statusCode, response };
  }
  const response = { success: success, error: data };
  return { statusCode, response };
};

const Response = {
  createResponse,
};

export default Response;
