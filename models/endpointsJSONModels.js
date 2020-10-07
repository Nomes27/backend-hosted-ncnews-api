const fs = require("fs");

const fetchEndPoints = (callback) => {
  fs.readFile("endpoints.json", (err, data) => {
    if (err) throw err;

    console.log(JSON.parse(data));

    return JSON.parse(data);
  });
};

module.exports = fetchEndPoints;
