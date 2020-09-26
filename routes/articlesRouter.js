const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
  deleteArticleById,
} = require("../controllers/articlesControllers");
const commentsRouter = require("./articleCommentsRouter");
const { error405Handler } = require("../errors");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.delete("/:article_id", deleteArticleById);
articlesRouter.get("/", getArticles);
articlesRouter.use("/", commentsRouter); //can't split up parametric endpoint, so have put all url in commentsRouter

articlesRouter.all("/*", error405Handler);
module.exports = articlesRouter;
