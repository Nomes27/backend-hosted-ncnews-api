const error404Handler = (req, res, next) => {
  res.status(404).send({ msg: "invalid file path" });
};

//ERROR HANDLING MIDDLEWARE FUNCTIONS

const error400Handler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
};
const error404NonExistentHandler = (err, req, res, next) => {
  //console.log(err)  ie.{ msg: 'article_id does not exist' }promsise.reject
  res.status(404).send({ msg: err.msg });
  next(err);
};

const error500Handler = (err, req, res, next) => {
  res.status(500).send({ msg: "sever error" });
};
module.exports = {
  error400Handler,
  error404NonExistentHandler,
  error404Handler,
  error500Handler,
};
