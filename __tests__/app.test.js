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
        it("status 404 - username does not exist", () => {
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
        it("status 200 - it responds with a specific article object when passed an article_id", () => {
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
        it("status 404 - article_id does not exist", () => {
          return request(app)
            .get("/api/articles/100")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article_id does not exist");
            });
        });
        it("status 400 - bad request : article_id should be a number", () => {
          return request(app)
            .get("/api/articles/notanumber")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request");
            });
        });
      });
      describe("PATCH", () => {
        it("status 200 - it responds with a specific article object where the votes property is increased by 1 when 1 is passed in the request body", () => {
          const incrementVotes = { inc_votes: 1 };
          return request(app)
            .patch("/api/articles/11")
            .send(incrementVotes)
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                article_id: 11,
                author: "icellusedkars",
                body:
                  "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
                //comment_count: 0,
                created_at: "1978-11-25T12:21:54.171Z",
                title: "Am I a cat?",
                topic: "mitch",
                votes: 1, //this shoud be increased to 1
              });
            });
        });
      });
    });
  });
});

/*ERRORS
No inc_votes on request body
Invalid inc_votes (e.g. { inc_votes : "cat" })
Some other property on request body (e.g. { inc_votes : 1, name: 'Mitch' }) */
