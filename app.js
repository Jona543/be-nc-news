const express = require('express')
const app = express()
const getTopics = require("./controllers/topics-controllers")
const endpoints = require("./endpoints.json")
const getArticleById = require('./controllers/articles-controllers')

app.get("/api/topics", getTopics)

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
})

app.get("/api/articles/:article_id", getArticleById)

module.exports = app