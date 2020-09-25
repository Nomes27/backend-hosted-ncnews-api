const { createComment, fetchComments } = require("../models/commentsModels");

const postComment = (req, res, next) => {
  const comment = req.body;
  const { article_id } = req.params;

  createComment(comment, article_id)
    .then((insertedComment) => {
      res.status(201).send(insertedComment);
    })
    .catch((err) => {
      next(err);
    });
};
const getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;
  req.query;
  console.groupCollapsed(article_id);
  fetchComments(article_id, sort_by, order)
    .then((returnedComments) => {
      res.status(200).send(returnedComments);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { postComment, getComments };
