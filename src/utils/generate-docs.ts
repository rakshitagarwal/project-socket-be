import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerDoc from "../../openapi.json";
import { ENDPOINTS } from "../common/constants";
import { name } from "../../package.json";

export const generateDocs = (app: Express) => {
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
