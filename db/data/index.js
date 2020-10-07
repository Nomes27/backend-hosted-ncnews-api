const ENV = process.env.NODE_ENV || "development";
const data = {
  test: require("./test-data/index"),
  development: require("./development-data/index"),
  production: require("./development-data/index"),
};

module.exports = data[ENV];
