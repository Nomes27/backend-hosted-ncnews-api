const commentsRouter = require("express").Router();
const {
  postComment,
  getComments,
} = require("../controllers/commentsControllers");
commentsRouter.post("/:article_id/comments", postComment);
commentsRouter.get("/:article_id/comments", getComments);

module.exports = commentsRouter;
