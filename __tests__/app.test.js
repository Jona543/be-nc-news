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
    test("GET: 200, responds with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
})