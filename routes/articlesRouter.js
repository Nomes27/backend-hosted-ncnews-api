const articlesRouter = require("express").Router();
const {
  getArticles,
  patchArticles,
} = require("../controllers/articlesControllers");
const commentsRouter = require("./commentsRouter");

const error405Handler = (req, res, next) => {
  console.log(req.method);
  res.status(405).send({ msg: "method not permitted" });
};
articlesRouter.get("/:article_id", getArticles);
articlesRouter.patch("/:article_id", patchArticles);
articlesRouter.use("/:article_id", commentsRouter);
articlesRouter.all("/*", error405Handler);
module.exports = articlesRouter;
