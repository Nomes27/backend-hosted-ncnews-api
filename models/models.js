const knex = require("../db/connection");

const fetchTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .then((topicsData) => {
      return { topics: topicsData };
    });
};

module.exports = { fetchTopics };
