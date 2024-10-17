const request = require("supertest")
const app = require("../app")

const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

const db = require("../db/connection")
const endpoints = require("../endpoints.json")
const toBeSorted = require("jest-sorted")



beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe("/api/topics", () => {
    test('GET: 200 - Responds with an array containing all topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            const topics = response.body.rows
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    });
})

describe("/api", () => {
    test("GET: 200 - responds with an object containing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("GET: 200 - responds with a specific article depending on its id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
            expect(response.body.article.article_id).toBe(1)
            expect(response.body.article.title).toBe("Living in the shadow of a great man")
            expect(response.body.article.topic).toBe("mitch")
            expect(response.body.article.author).toBe("butter_bridge")
            expect(response.body.article.body).toBe("I find this existence challenging")
            expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(response.body.article.votes).toBe(100)
            expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })
    test("GET: 400 - responds with an error message when given invalid article_id", () => {
        return request(app)
        .get("/api/articles/article_id")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Id Type")
        })
    })
    test("GET: 404 - responds with an error message when given valid article_id that doesn't exist", () => {
        return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Article Not Found")
        })
    })
})

describe("/api/articles", () => {
    test("GET: 200 - responds with an array of articles with correct properties present", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const articles = response.body
            expect(articles.length).toBe(13)
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })
    test("GET: 200 - responds with array of articles sorted by date in descending order by default", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at", {descending: true})
        })
    })
    test("GET: 200 - responds with array of articles sorted by any valid column", () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("author", {descending: true})
        })
    })
    test("GET: 200 - responds with an array of articles sorted by date in ascending order when specified", () => {
        return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at")
        })
    })
    test("GET: 404 - responds with an error when passed a sort by query that doesn't exist", () => {
        return request(app)
        .get("/api/articles?sort_by=sausage")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Invalid Input')
        })
    })
    test("GET: 404 - responds with an error when passed an order query that is invalid", () => {
        return request(app)
        .get("/api/articles?order=sausage")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Invalid Order Query')
        })
    })
    test("GET: 200 - responds with an array of articles filtered by the specified topic query", () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
            const articles = response.body
            expect(articles.length).toBe(1)
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        topic: "cats"
                    })
                )
            })
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("GET: 200 - responds with array of comments for the given article with correct properties", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
            const comments = response.body
            expect(comments.length).toBe(11)
            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    })
                )
            })
        })
    })
    test("GET: 200 - comments array should be in the order in which they were posted with most recent comments first", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at")
        })
    })
    test("GET: 200 - responds with empty array when passed an article that exists but has no comments", () => {
        return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(0)
        })
    })
    test("GET: 400 - responds with error message when given an invalid article_id", () => {
        return request(app)
        .get("/api/articles/article_id/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Id Type")
        })
    })
    test("GET: 404 - responds with error message when given valid article_id that doesn't exist", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Article Not Found")
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("POST: 201 - responds with newly posted comment", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({username: "lurker", body: "This article is sick"})
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toMatchObject({
                author: "lurker", 
                body: "This article is sick", 
                article_id: 1, 
                votes: 0, 
                comment_id: expect.any(Number), 
                created_at: expect.any(String)})
        })
    })
    test("POST: 400 - responds with error message if given invalid article id", () => {
        return request(app)
        .post("/api/articles/article_id/comments")
        .send({username: "lurker", body: "This article is sick"})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Id Type")
        })
    })
    test("POST: 404 - responds with error message if given non existent article id", () => {
        return request(app)
        .post("/api/articles/999/comments")
        .send({username: "lurker", body: "This article is sick"})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Article Not Found")
        })
    })
    test("POST: 400 - responds with error message if given object with missing properties", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({username: "lurker"})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Missing Information")
        })
    })
})

describe("/api/articles/:article_id", () => {
    test("PATCH: 200 - should respond with an updated article with changed number of votes", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 10})
        .expect(200)
        .then(({body}) => {
            expect(body.votes).toBe(110)
        })
    })
    test("PATCH: 400 - should respond with an error when passed a body that does not contain the correct fields", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Missing Information")
        })
    })
    test("PATCH: 404 - should respond with an error when passed an article id that doesn't exist", () => {
        return request(app)
        .patch("/api/articles/9999")
        .send({inc_votes: 10})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Article Not Found")
        })
    })
    test("PATCH: 400 - should respond with an error when passed an article that isn't valid", () => {
        return request(app)
        .patch("/api/articles/article_id")
        .send({inc_votes: 10})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("Invalid Id Type")
        })
    })
    test("PATCH: 400 - should respond with an error when passed invalid data type for a correct key", () => {
        return request(app)
        .patch("/api/articles/article_id")
        .send({inc_votes: 'cat'})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid Id Type')
        })
    })
})

describe("/api/comments/:comment_id", () => {
    test("DELETE: 204 - responds with correct status code", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
            return request(app)
            .get("/api/comments/1")
            .expect(404)
        })
    })
})

describe("/api/users", () => {
    test("GET: 200 - responds with an array of all users with the correct properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            const users = response.body
            expect(users.length).toBe(4)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    })
})

