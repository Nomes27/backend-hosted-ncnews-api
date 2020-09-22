const error404UsernameHandler = (err, req, res, next) => {
  res.status(404).send({ msg: "user does not exist" });
};

const error404Handler = (req, res, next) => {
  res.status(404).send({ msg: "invalid file path" });
};
const error500Handler = (err, req, res, next) => {
  res.status(500).send({ msg: "sever error" });
};
module.exports = { error404UsernameHandler, error404Handler, error500Handler };
