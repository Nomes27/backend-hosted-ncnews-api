const {
  fetchArticles,
  changeVotesForArticle,
} = require("../models/articlesModels");

const getArticles = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticles(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticles = (req, res, next) => {
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

module.exports = { getArticles, patchArticles };
