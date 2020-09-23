const request = require("supertest");
const app = require("../app");
const knex = require("../db/connection");

beforeEach(() => {
  return knex.seed.run();
});
afterAll(() => {
  return knex.destroy();
});

describe("app", () => {
  it("status 404 - invalid file path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid file path");
      });
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
    describe("/users/:username", () => {
      describe("GET", () => {
        it("status 200 - it responds with a specific user object", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              });
            });
        });
        it("status 400 - username does not exist", () => {
          return request(app)
            .get("/api/users/dog")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("user does not exist");
            });
        });
      });
    });
    describe("/articles/:article_id", () => {
      describe("GET", () => {
        it("status 200 - it responds with a specific article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: 13,
              });
            });
        });
      });
    });
  });
});
