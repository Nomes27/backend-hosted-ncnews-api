const commentsRouter = require("express").Router();
const {
  postComment,
  getComments,
} = require("../controllers/commentsControllers");
commentsRouter.post("/", postComment);
commentsRouter.get("/", getComments);

module.exports = commentsRouter;
