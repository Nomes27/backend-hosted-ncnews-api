const articlesRouter = require("express").Router();
const getArticles = require("../controllers/articlesControllers");
articlesRouter.get("/:article_id", getArticles);

module.exports = articlesRouter;
