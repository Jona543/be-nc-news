const { fetchArticleById, fetchArticle, fetchCommentsByArticle } = require("../models/articles-models")

const getArticleById = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleById(article_id).then((article) => {
        response.status(200).send({ article })
    }).catch((err) => {
        next(err)
    })
}

const getArticle = (request, response, next) => {
    fetchArticle().then((articles) => {
        response.status(200).send(articles)
    }).catch((err) => {
        next(err)
    })
}

const getCommentsByArticle = (request, response, next) => {
    const { article_id } = request.params
    fetchCommentsByArticle(article_id).then((comments) => {
        response.status(200).send(comments)
    }).catch((err) => {
        next(err)
    })
}

module.exports = { getArticleById, getArticle, getCommentsByArticle }