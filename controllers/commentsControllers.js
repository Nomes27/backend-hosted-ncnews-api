const {
  createComment,
  fetchComments,
  fetchCommentById,
  fetchCommentToDelete,
} = require("../models/commentsModels");

//COMMENTS RELATING TO ARTICLE_ID -UNDER ENDPOINT API/ARTICLES/:ARTICLE_ID/COMMENTS
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
  const { sort_by, order, limit, p } = req.query;

  fetchComments(article_id, sort_by, order, limit, p)
    .then((returnedComments) => {
      res.status(200).send(returnedComments);
    })
    .catch((err) => {
      next(err);
    });
};

//COMMENTS UNDER THE ENDPOINT OF API/COMMENTS/:COMMENT_ID
const patchCommentById = (req, res, next) => {
  //
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  fetchCommentById(comment_id, inc_votes)
    .then((returnedComment) => {
      res.status(200).send(returnedComment);
    })
    .catch((err) => {
      next(err);
    });
};
const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  fetchCommentToDelete(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  postComment,
  getComments,
  patchCommentById,
  deleteCommentById,
};
