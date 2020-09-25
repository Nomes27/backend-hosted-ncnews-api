const {
  fetchArticleById,
  changeVotesForArticle,
  fetchArticles,
} = require("../models/articlesModels");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  console.log(inc_votes);
  changeVotesForArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchArticles()
    .then((allArticles) => {
      console.log(allArticles);
      res.status("200").send(allArticles);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, patchArticleById, getArticles };
