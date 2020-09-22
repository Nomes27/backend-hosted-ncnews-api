const app = require("express")();
const apiRouter = require("./routes/apiRouter");
const {
  error404Handler,
  error404UsernameHandler,
  error500Handler,
} = require("./errors");

app.use("/api", apiRouter);
app.all("/*", error404Handler);

app.use(error404UsernameHandler);

app.use(error500Handler);
module.exports = app;
