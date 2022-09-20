import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import fs from "fs";

export const add = async (origin, body, moduleName, file) => {
  if (body.image) {
    return createResponse(
      helpers.StatusCodes.OK,
      `Image Uploaded ${helpers.StatusMessages.OK}`,
      {
        path: origin + "/" + file.path,
        fileName: file.filename,
      }
    );
  }
  return createResponse(
    helpers.StatusCodes.BAD_REQUEST,
    helpers.StatusMessages.BAD_REQUEST
  );
};

export const remove = async (query, path) => {
  let fileRemovePromise = new Promise((resolve, reject) => {
    fs.unlink("./" + path, function (err) {
      if (err && err.code == "ENOENT") {
        reject({
          code: helpers.StatusCodes.NOT_FOUND,
          message: helpers.StatusMessages.NOT_FOUND,
          stack: err.stack,
        });
      } else if (err) {
        reject({
          code: helpers.StatusCodes.BAD_REQUEST,
          message: helpers.StatusMessages.BAD_REQUEST,
          stack: err.stack,
        });
      }
      resolve({
        code: helpers.StatusCodes.OK,
        message: "Files Deleted",
      });
    });
  });
  try {
    const response = await fileRemovePromise;
    return createResponse(response.code, response.message, {});
  } catch (error) {
    return createResponse(error.code, error.message, {}, error.stack);
  }
};

export const update = async (origin, query, body, file) => {
  let fileRemovePromise = new Promise((resolve, reject) => {
    fs.unlink("./" + query.path, function (err) {
      if (err && err.code == "ENOENT") {
        reject(
          createResponse(
            helpers.StatusCodes.NOT_FOUND,
            err.message,
            {},
            {
              stack: err.stack,
            }
          )
        );
      } else if (err) {
        reject(
          createResponse(
            helpers.StatusCodes.BAD_REQUEST,
            "Error occurred while trying to remove file",
            {},
            {
              stack: err.stack,
            }
          )
        );
      }
      resolve(createResponse(helpers.StatusCodes.OK, "File Deleted"));
    });
  });

  const response = await fileRemovePromise;

  if (response?.statusCode) {
    if (body?.image) {
      return createResponse(
        helpers.StatusCodes.OK,
        `Image Updated ${helpers.StatusMessages.OK}`,
        {
          path: origin + "/" + file.path,
          fileName: file.filename,
        }
      );
    }
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.StatusMessages.BAD_REQUEST
    );
  }

  return response;
};
