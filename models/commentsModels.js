const knex = require("../db/connection");

const createComment = (comment, article_id) => {
  return (
    knex
      .insert({
        author: comment.username,
        body: comment.body,
        article_id: article_id,
      })
      .into("comments")

      .returning(["body", "author"])
      //to change author to username
      .then((insertedComment) => {
        copyInsertedComment = insertedComment[0];
        copyInsertedComment.username = copyInsertedComment.author;
        delete copyInsertedComment.author;

        return copyInsertedComment;
      })
  );
};
const fetchComments = (article_id) => {
  /////
  return knex("comments")
    .where("article_id", article_id)
    .returning("*")
    .then((allComments) => {
      console.log(allComments);
      return allComments;
    });
};

module.exports = { createComment, fetchComments };
