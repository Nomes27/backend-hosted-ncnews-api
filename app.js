const app = require("express")();
const apiRouter = require("./routes/apiRouter");

app.use("/api", apiRouter);

module.exports = app;
