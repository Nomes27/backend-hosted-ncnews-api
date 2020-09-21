const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");
const {
  articlesFormatter,
  commentsFormatter,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex.insert(topicData).into("topics").returning("*");
    })
    .then((insertedTopics) => {
      return knex.insert(userData).into("users").returning("*");
    })
    .then((insertedUsers) => {
      const articles = articlesFormatter(articleData);
      return knex.insert(articles).into("articles").returning("*");
    })
    .then((insertedArticles) => {
      console.log(insertedArticles);
      /*
                  belongs_to (article.title) --> article_id
                  author
                  */
    })
    .catch((err) => {
      console.log(err);
    });
};
