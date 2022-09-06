import createError from "http-errors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import statusCodes from "./common/statusCodes.js";
const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/test", (req, res, next) => {
    try {
        throw new Error("error");
    } catch (ex) {
        next(ex);
    }
});

app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR);
    res.send(err);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
