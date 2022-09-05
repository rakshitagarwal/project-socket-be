import logger from "./common/logger.js";
import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello World!");
    logger.error("information log");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
