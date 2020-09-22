const express = require("express");

const topicsRouter = express.Router();
const { getTopics } = require("../controllers/controllers");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
