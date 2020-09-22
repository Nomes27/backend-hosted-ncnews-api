const request = require("supertest");
const app = require("../app");
const knex = require("../db/connection");

beforeEach(() => {
  return knex.seed.run();
});
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
                  description: "The man, the Mitch, the legend",
                  slug: "mitch",
                },
                {
                  description: "Not dogs",
                  slug: "cats",
                },
                {
                  description: "what books are made of",
                  slug: "paper",
                },
              ],
            });
          });
      });
    });
  });
});
