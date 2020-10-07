const fetchEndpoints = require("../models/endpointsJSONModels");

const getEndPoints = (req, res, next) => {
  console.log("HELLLLOOOOOOOOOOO");
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = getEndPoints;
