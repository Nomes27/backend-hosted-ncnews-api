const knex = require("../db/connection");

const createComment = (comment, article_id) => {
  console.log(comment);
  return knex
    .insert(comment, article_id)
    .into("comments")

    .returning("*")
    .then((addedComment) => {
      console.log(addedComment);
      return addedComment;
    });
};

module.exports = { createComment };
