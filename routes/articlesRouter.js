const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("../controllers/articlesControllers");
const commentsRouter = require("./commentsRouter");
const { error405Handler } = require("../errors");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.get("/", getArticles);
articlesRouter.use("/", commentsRouter); //can't split up parametric endpoint, so have put all url in commentsRouter

articlesRouter.all("/*", error405Handler);
module.exports = articlesRouter;
