const articlesRouter = require("express").Router();
const {
  getArticles,
  patchArticles,
} = require("../controllers/articlesControllers");
const commentsRouter = require("./commentsRouter");
const { error405Handler } = require("../errors");
const {
  postComment,
  getComments,
} = require("../controllers/commentsControllers");
articlesRouter.get("/:article_id", getArticles);
articlesRouter.patch("/:article_id", patchArticles);
articlesRouter.post("/:article_id/comments", postComment); //commentsRouter);-
articlesRouter.use("/:article_id", commentsRouter);

articlesRouter.all("/*", error405Handler);
module.exports = articlesRouter;
