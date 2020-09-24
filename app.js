const app = require("express")();
const express = require("express");
const apiRouter = require("./routes/apiRouter");
const {
  error400Handler,
  error404Handler,
  error404NonExistentHandler,
  error500Handler,
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", error404Handler);

app.use(error400Handler);
app.use(error404NonExistentHandler);

app.use(error500Handler);
module.exports = app;
