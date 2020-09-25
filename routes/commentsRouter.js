const commentsRouter = require("express").Router();
const {
  postComment,
  getComments,
} = require("../controllers/commentsControllers");
commentsRouter.get("/comments", getComments);

module.exports = commentsRouter;
