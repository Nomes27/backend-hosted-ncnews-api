const knex = require("../db/connection");

const fetchUser = (username) => {
  return knex("users")
    .where("username", username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ msg: "user does not exist" });
      } else {
        return user[0];
        //to get it out of the array
      }
    });
};

module.exports = { fetchUser };
