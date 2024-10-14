const express = require('express')
const app = express()
const getTopics = require("./controllers/topics-controllers")
const endpoints = require("./endpoints.json")


app.get("/api/topics", getTopics)

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
})

module.exports = app