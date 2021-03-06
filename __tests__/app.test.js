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
    describe("GET", () => {
      it("status 200- returns a json description of all the available endpoints of the api", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              "GET /api": {
                description:
                  "serves up a json representation of all the available endpoints of the api",
              },
              "GET /api/topics": {
                description: "serves an array of all topics",
                queries: [],
                exampleResponse: {
                  topics: [{ slug: "football", description: "Footie!" }],
                },
              },
              "GET /api/articles": {
                description: "serves an array of all topics",
                queries: [
                  "author",
                  "topic",
                  "sort_by",
                  "order",
                  "limit",
                  "page",
                ],
                exampleResponse: {
                  articles: [
                    {
                      title: "Seafood substitutions are increasing",
                      topic: "cooking",
                      author: "weegembump",
                      body: "Text from the article..",
                      created_at: 1527695953341,
                    },
                  ],
                },
              },
              "GET api/users/:username": {
                description:
                  "serves a specific user object when passed a username",
                queries: [],
                exampleResponse: {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
              },

              "GET /api/articles/:article_id": {
                description:
                  "serves an article object when passed an article_id",
                queries: [],
                exampleResponse: {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  body: "I find this existence challenging",
                  votes: 100,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "2018-11-15T12:21:54.171Z",
                  comment_count: 13,
                },
              },
              "PATCH /api/articles/:article_id": {
                description:
                  "allows the votes property to be incremented or decremented when passed an inc_votes object",
                queries: [],
                examplePatch: { inc_votes: 1 },
              },
              "DELETE /api/articles/:article_id": {
                description:
                  "allows an article to be deleted by it's article_id",
              },

              "GET /api/articles/:article_id/comments": {
                description:
                  "serves an array or article comments from the specified article_id",
                queries: ["sort_by", "order", "limit", "page"],
              },
              "POST /api/articles/:article_id/comments": {
                description:
                  "allows a comment to be posted to a specific article_id",
                queries: [],
                examplePost: {
                  username: "icellusedkars",
                  body:
                    "This is the best article I've ever read. Insightful is an understatement.",
                },
              },
              "PATCH /api/comments/comment_id": {
                description:
                  "allows a comment's vote property to be incremented or decremented",
                queries: [],
                examplePatch: { inc_votes: 1 },
              },

              "DELETE /api/comments/comment_id": {
                description: "allows a comment to be deleted by it's id",
                queries: [],
              },
            });
          });
      });
    });
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
              expect(body.length).toBe(10); //would be 12, but now have limit query
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
        it("status 200 - responds to an author query with an array of article objects relating to the passed in author", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(6);
              body.forEach((article) => {
                expect(article.author).toBe("icellusedkars");
              });
            });
        });
        it("status 200 - responds to a topic query with an array of article objects relating to the passed in topic", () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(1);
              body.forEach((article) => {
                expect(article.topic).toBe("cats");
              });
            });
        });
        it("status 200 - has a default limit query of 10 and a page query", () => {
          return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(2);
            });
          //12 total, limit defaults to 10, so on page 2 the length should be 2
        });
        it("status 200 - accepts a limit query which is different to the default of 10 and a page query", () => {
          return request(app)
            .get("/api/articles?limit=3&&p=3")
            .expect(200)
            .then(({ body }) => {
              expect(body.length).toBe(3);
              //12 total, 3 per page. p3 should have length of 3
              //would expect article ids to be 7,8,9
              body.forEach((article, index) => {
                if (index === 0) {
                  expect(article.article_id).toBe(7);
                } else if (index === 1) {
                  expect(article.article_id).toBe(8);
                } else if (index === 2) {
                  expect(article.article_id).toBe(9);
                }
              });
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
              .post("/api/articles/2")

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
        describe("DELETE", () => {
          it("status 204 -deletes the article when passed an article_id", () => {
            return request(app)
              .delete("/api/articles/1")
              .expect(204)
              .then(({ body }) => {
                expect(body).toEqual({});
              })
              .then(() => {
                return request(app)
                  .get("/api/articles/1")
                  .expect(404)
                  .then(({ body: { msg } }) => {
                    expect(msg).toEqual("article_id does not exist");
                  });
              });
          });
          it("status 400 - bad request, article_id should be a number", () => {
            return request(app)
              .delete("/api/articles/dog")
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
                expect(body.length).toBe(10);
                //was 13 but now limit introduced
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

                expect(body).toBeSortedBy("created_at", { descending: true });
              });
          });
          it("status 200 - accepts queries : comments should be sorted by votes in ascending order, when passed a sort_by query and an order query", () => {
            return request(app)
              .get("/api/articles/9/comments?sort_by=votes&&order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body).toBeSortedBy("votes");
              });
          });
          it("status 200 - accepts a limit query which defaults to 10", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.length).toBe(10);
              });
          });
          it("status 200- accepts a page query", () => {
            return (
              request(app)
                .get("/api/articles/1/comments?limit=2&&p=2")
                //13 total
                //length should be two and comment id should be 3 and 4
                .expect(200)
                .then(({ body }) => {
                  expect(body.length).toBe(2);
                })
            );
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
    describe("/comments", () => {
      describe("':comment_id", () => {
        describe("PATCH", () => {
          it("status 200 - accepts an object with the key of inc_votes and a value which indicates how much the comment votes should be updated by", () => {
            const increaseVotes = { inc_votes: 1 };
            return request(app)
              .patch("/api/comments/1")
              .expect(200)
              .send(increaseVotes)
              .then(({ body }) => {
                expect(body).toEqual({
                  article_id: 9,
                  author: "butter_bridge",
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                  comment_id: 1,
                  created_at: "2017-11-22T12:36:03.389Z",
                  votes: 17,
                });
              });
          });
          it("status 200 - decreases the votes of the comment when passed an object containing inc_votes and a negative value", () => {
            const decreaseVotes = { inc_votes: -1 };
            return request(app)
              .patch("/api/comments/1")
              .send(decreaseVotes)
              .then(({ body }) => {
                expect(body.votes).toBe(15);
              });
          });
          it("status 405 - method not allowed", () => {
            return request(app)
              .post("/api/comments/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toEqual("method not allowed");
              });
          });
          it("status 404 - comment_id does not exist", () => {
            const increaseVotes = { inc_votes: 1 };
            return request(app)
              .patch("/api/comments/1000")
              .send(increaseVotes)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("comment_id does not exist");
              });
          });
          it("status 400 - bad request :comment_id should be a number", () => {
            const increaseVotes = { inc_votes: 1 };
            return request(app)
              .patch("/api/comments/dog")
              .send(increaseVotes)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request");
              });
          });
        });
        describe("DELETE", () => {
          it("status 204 - it deletes the given comment by it's comment_id and responds with status 204 ", () => {
            return request(app)
              .delete("/api/comments/1")
              .expect(204)
              .then(({ body }) => {
                expect(body).toEqual({});
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
