const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById,
} = require("../controllers/commentsControllers");
const { error405Handler } = require("../errors");
commentsRouter.patch("/:comment_id", patchCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.all("/*", error405Handler);
module.exports = commentsRouter;
