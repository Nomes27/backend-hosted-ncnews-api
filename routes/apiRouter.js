const express = require("express");

const apiRouter = express.Router();
const topicsRouter = require("./topicsRouter");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
