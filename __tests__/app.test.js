process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const knex = require("../db/connection");

afterAll(() => {
  return knex.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it("status 200 - responds with an object, which holds an array on the key of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              topics: [
                {
                  description: "Code is love, code is life",
                  slug: "coding",
                },
                {
                  description: "FOOTIE!",
                  slug: "football",
                },
                {
                  description: "Hey good looking, what you got cooking?",
                  slug: "cooking",
                },
              ],
            });
          });
      });
    });
  });
});
