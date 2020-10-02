const {
  fetchArticleById,
  changeVotesForArticle,
  fetchArticles,
  fetchArticleToDelete,
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

  changeVotesForArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;

  fetchArticles(sort_by, order, author, topic, limit, p)
    .then((allArticles) => {
      res.status(200).send(allArticles);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleToDelete(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  patchArticleById,
  getArticles,
  deleteArticleById,
};
