import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerDoc from "../../openapi.json";
import { ENDPOINTS } from "../common/constants";
import { name } from "../../package.json";

/**
 * Generates and serves API documentation using Swagger UI.
 * @param {Express} app - The Express app to which the documentation route will be added.
 * @returns {void}
 */
export const generateDocs = (app:Express) => {
    app.use(
        ENDPOINTS.DOCS,
        serve,
        setup(swaggerDoc, {
            swaggerOptions: { filter: "", persistAuthorization: true },
            customSiteTitle: name,
            isExplorer: true,
            explorer: true,
        })
    );
};

