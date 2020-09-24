const articlesRouter = require("express").Router();
const {
  getArticles,
  patchArticles,
} = require("../controllers/articlesControllers");

articlesRouter.get("/:article_id", getArticles);
articlesRouter.patch("/:article_id", patchArticles);

module.exports = articlesRouter;
