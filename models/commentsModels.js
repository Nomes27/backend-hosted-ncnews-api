const knex = require("../db/connection");

//COMMENTS RELATING TO ARTICLE_ID -UNDER ENDPOINT API/ARTICLES/:ARTICLE_ID/COMMENTS
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
const fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  p
) => {
  /////
  const offset = (p - 1) * limit;
  return knex("comments")
    .where("article_id", article_id)
    .returning("*")
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, order)
    .then((allComments) => {
      if (allComments.length === 0) {
        return Promise.reject({ msg: "article_id does not exist" });
      } else {
        return allComments;
      }
    });
};
//COMENTS UNDER THE ENDPOINT OF API/COMMENTS/:COMMENT_ID

const fetchCommentById = (comment_id, inc_votes) => {
  return knex("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([comment]) => {
      //array destructuring
      if (!comment) {
        return Promise.reject({ msg: "comment_id does not exist" });
      } else {
        return comment;
      }
    });
};

const fetchCommentToDelete = (comment_id) => {
  return knex("comments")
    .where("comment_id", comment_id)
    .del()
    .then(() => {
      return;
    });
};

module.exports = {
  createComment,
  fetchComments,
  fetchCommentById,
  fetchCommentToDelete,
};
