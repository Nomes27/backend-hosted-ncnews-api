const express = require("express");

const apiRouter = express.Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const endpoints = require("../public/endpoints.json");
//apiRouter.get("/", getEndPoints);
//apiRouter.get("/", express.static(__dirname + "/public"));

apiRouter.get("/", function (req, res, next) {
  res.json(endpoints);
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
module.exports = apiRouter;
