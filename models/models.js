const knex = require("../db/connection");

const fetchTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .returning("*")
    .then((topicsData) => {
      console.log(topicsData);
      return { topics: topicsData };
    });
};

module.exports = { fetchTopics };
