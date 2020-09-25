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
    describe("/users", () => {
      describe("/:username", () => {
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
          it("status 405 - method not allowed", () => {
            return request(app)
              .delete("/api/users/butter-bridge")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed");
              });
          });
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        it("status 200 - returns an array of article objects, which should have properties of author, title, article_id, topic, created_at, votes, comment_count", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(12);
              expect(Array.isArray(body)).toBe(true);
              body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("comment_count");
              });
            });
        });
        it("status 200- articles should sort_by created_at by default and be ordered in descending order by default", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("created_at", { descending: true });
            });
        });
        it("status 200 - reponds when passed a query of sort_by author and an order query of ascending", () => {
          return request(app)
            .get("/api/articles?sort_by=author&&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeSortedBy("author");
            });
        });
        it("status 200 - responds to an author query with articles relating to the passed in author", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars")
            .expect(200)
            .then(({ body }) => {
              ////
            });
        });
      });
      describe("/:article_id", () => {
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
          it("status 200 - the article should have a new property of comment_count", () => {
            return request(app)
              .get("/api/articles/2")
              .expect(200)
              .then(({ body }) => {
                expect(body).hasOwnProperty("comment_count");
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
          it("status 405 - method not allowed", () => {
            return request(app)
              .delete("/api/articles/2")

              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed");
              });
          });
        });
        describe("PATCH", () => {
          it("status 200 - it responds with a specific article object where the votes property is increased", () => {
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
                  votes: 1,
                });
              });
          });
          it("status 200 - it responds with a specific article object where the votes property is decreased", () => {
            const decrementVotes = { inc_votes: -1 };
            return request(app)
              .patch("/api/articles/1")
              .send(decrementVotes)
              .expect(200)
              .then(({ body }) => {
                expect(body).toEqual({
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 99,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                });
              });
          });
          it("status 404 - article_id does not exist", () => {
            const incrementVotes = { inc_votes: 1 };
            return request(app)
              .patch("/api/articles/1000")
              .send(incrementVotes)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("article_id does not exist");
              });
          });
          it("status 400 - bad request : article_id should be a number", () => {
            const incrementVotes = { inc_votes: 2 };
            return request(app)
              .patch("/api/articles/dog")
              .send(incrementVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toEqual("bad request");
              });
          });
          it("status 400 - bad request : inc_votes should be a number", () => {
            const incrementVotes = { inc_votes: "dog" };
            return request(app)
              .patch("/api/articles/1")
              .send(incrementVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request");
              });
          });
        });
      });
      describe("/api/articles/:article_id/comments", () => {
        describe("POST", () => {
          it("status 201 - it responds with a posted comment with properties of username and body", () => {
            const comment = {
              username: "icellusedkars",
              body:
                "This is the best article I've ever read. Insightful is an understatement.",
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(201)
              .then(({ body }) => {
                expect(body).toEqual({
                  username: "icellusedkars",
                  body:
                    "This is the best article I've ever read. Insightful is an understatement.",
                });
                expect(body).hasOwnProperty("username");
                expect(body).hasOwnProperty("body");
              });
          });
          it("status 400 - bad request :article_id should be a number", () => {
            const comment = {
              username: "icellusedkars",
              body:
                "This is the best article I've ever read. Insightful is an understatement.",
            };
            return request(app)
              .post("/api/articles/cat/comments")
              .send(comment)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request");
              });
          });
        });
        describe("GET", () => {
          it("status 200 - responds with an array of comments from the specified article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.length).toBe(13);
              });
          });
          it("status 200- each comment should have properties of comment_id, votes, created_at, author and body", () => {
            return request(app)
              .get("/api/articles/9/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body).hasOwnProperty("comment_id");
                expect(body).hasOwnProperty("votes");
                expect(body).hasOwnProperty("created_at");
                expect(body).hasOwnProperty("author");
                expect(body).hasOwnProperty("body");
                expect(body.length).toBe(2);
              });
          });
          it("status 200 - comments should be sorted by default by created_at, with a default order of descending", () => {
            return request(app)
              .get("/api/articles/9/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.length).toBe(2);
                console.log(body);
                expect(body).toBeSortedBy("created_at", { descending: true });
              });
          });
          it("status 200 - accepts queries : comments should be sorted by votes in ascending order, when passed a sort_by query and an order query", () => {
            return request(app)
              .get("/api/articles/9/comments?sort_by=votes&&order=asc")
              .expect(200)
              .then(({ body }) => {
                console.log(body);
                expect(body).toBeSortedBy("votes");
              });
          });
          it("status 400 - bad request : article_id should be a number", () => {
            return request(app)
              .get("/api/articles/dog/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request");
              });
          });
          it("status 404 - article_id does not exist", () => {
            return request(app)
              .get("/api/articles/3000/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("article_id does not exist");
              });
          });
        });
      });
    });
  });
});

//do array destructuring  .then ([item])
//rest operator, put inside what want change rater than underneath
//comments?sort_by=columnname
