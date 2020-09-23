const knex = require("../db/connection");

const fetchArticles = (article_id) => {
  /*return knex("articles")
    .where("article_id", article_id)
    .then((article) => {
      return article[0];
    });*/
  return knex
    .select(
      "articles.article_id",
      "title",
      "articles.body",
      "articles.votes",
      "topic",
      "articles.author",
      "articles.created_at"
    )
    .from("articles")
    .where("articles.article_id", article_id)
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      //transform comment_count to a number:
      const commentCountToNum = article.map((arti) => {
        arti.comment_count = Number(art.comment_count);
        return arti;
      });

      return commentCountToNum[0];
    });

  //COUNT ALL COMMENTS WHICH USE THIS ARTICLE_ID
  //NEEDS total count of all the comments with this article_id - you should make use of knex queries in order to achieve this
};

module.exports = fetchArticles;
