const knex = require("../db/connection");

const fetchArticleById = (article_id) => {
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
      if (article.length === 0) {
        return Promise.reject({ msg: "article_id does not exist" });
      } else {
        //transform comment-count to a number
        const commentCountToNum = article.map((arti) => {
          const copyArticle = { ...arti };
          copyArticle.comment_count = Number(copyArticle.comment_count);
          return copyArticle;
        });

        return commentCountToNum[0];
      }
    });

  //COUNT ALL COMMENTS WHICH USE THIS ARTICLE_ID
  //NEEDS total count of all the comments with this article_id - you should make use of knex queries in order to achieve this
};
//below shows article without comment count
const changeVotesForArticle = (article_id, inc_votes) => {
  return knex("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ msg: "article_id does not exist" });
      } else {
        return article[0];
      }
    });
  //.increment("votes", inc_votes);
};

const fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return (
    knex
      .select(
        "articles.article_id",
        "title",
        "articles.body",
        "articles.votes",
        "topic",
        "articles.author",
        "articles.created_at"
      )
      //this modify method lets us use a conditional statement for if author is actuallyy defined as a query
      .modify((query) => {
        if (author) {
          query.where("articles.author", author);
        }
      })
      .modify((query) => {
        if (topic) {
          query.where("topic", topic);
        }
      })

      .from("articles")
      .count({ comment_count: "comments.article_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .then((article) => {
        if (article.length === 0) {
          return Promise.reject({ msg: "article_id does not exist" });
        } else {
          //transform comment-count to a number
          const commentCountToNum = article.map((arti) => {
            const copyArticle = { ...arti };
            copyArticle.comment_count = Number(copyArticle.comment_count);
            return copyArticle;
          });

          return commentCountToNum;
        }
      })
  );
};

const fetchArticleToDelete = (article_id) => {
  return knex("articles")
    .where("article_id", article_id)
    .del()

    .then(() => {
      return;
    });
}; //Key (article_id)=(1) is still referenced from table "comments".', -- want to delete all comments which then reference the article_id too - to deal with this had to put onDelete("CASCADE") in the comments schema where it reference article_id

module.exports = {
  changeVotesForArticle,
  fetchArticleById,
  fetchArticles,
  fetchArticleToDelete,
};
