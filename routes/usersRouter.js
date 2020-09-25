const usersRouter = require("express").Router();
const { getUser } = require("../controllers/usersControllers");
const { error405Handler } = require("../errors");
usersRouter.get("/:username", getUser);
usersRouter.all("/*", error405Handler); //define in errors folder and do same for articlesrouter all function

module.exports = usersRouter;
