const request = require("supertest")
const app = require("../app")

const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

const db = require("../db/connection")
const endpoints = require("../endpoints.json")



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
            expect(response.body.article[0].article_id).toBe(1)
            expect(response.body.article[0].title).toBe("Living in the shadow of a great man")
            expect(response.body.article[0].topic).toBe("mitch")
            expect(response.body.article[0].author).toBe("butter_bridge")
            expect(response.body.article[0].body).toBe("I find this existence challenging")
            expect(response.body.article[0].created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(response.body.article[0].votes).toBe(100)
            expect(response.body.article[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
    })
})
