const commentsRouter = require("express").Router();
const { postComment } = require("../controllers/commentsControllers");
commentsRouter.post("/comments", postComment);

module.exports = commentsRouter;
