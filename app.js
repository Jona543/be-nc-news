const express = require('express')
const app = express()
const getTopics = require("./controllers/topics-controllers")
const endpoints = require("./endpoints.json")
const { getArticleById, getArticle, getCommentsByArticle, postCommentsByArticle } = require('./controllers/articles-controllers')
const { psqlErrorHandler, customErrorHandler } = require("./error-handlers")

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
})

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticle)

app.get("/api/articles/:article_id/comments", getCommentsByArticle)

app.post("/api/articles/:article_id/comments", postCommentsByArticle)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

module.exports = app