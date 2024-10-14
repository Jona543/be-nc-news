const fetchTopics = require("../models/topics-models")

const getTopics = (request, response, next) => {
    fetchTopics().then((data) => {
        response.status(200).send(data)
    }).catch((err) => {
        next(err)
    })
}

module.exports = getTopics