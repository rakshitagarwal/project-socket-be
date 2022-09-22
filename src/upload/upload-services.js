import { createResponse } from "../common/utilies.js";
import { helpers } from "../helper/helpers.js";
import fs from "fs";

export const add = async (origin, body, moduleName, file) => {
  if (body.image) {
    return createResponse(
      helpers.StatusCodes.OK,
      `Image Uploaded ${helpers.StatusMessages.OK}`,
      {
        path: file.path,
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
            err.stack
          )
        );
      } else if (err) {
        reject(
          createResponse(
            helpers.StatusCodes.BAD_REQUEST,
            "Error occurred while trying to remove file",
            {},
            err.stack
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
          path: file.path,
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

export const multiple = async (moduleName, files) => {
  const path = [];
  const filename = [];

  for (let index = 0; index < files.length; index++) {
    path.push(files[index].path);
    filename.push(files[index].filename);
  }

  if (!path || !filename) {
    return createResponse(
      helpers.StatusCodes.BAD_REQUEST,
      helpers.StatusMessages.BAD_REQUEST
    );
  }
  return createResponse(helpers.StatusCodes.OK, "Multiple Images uploaded", {
    path: path,
    filenName: filename,
  });
};
