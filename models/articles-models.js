const db = require("../db/connection")

const fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        return result.rows
    })
}

const fetchArticle = () => {
    return db.query(`SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT OUTER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
        .then((result) => {
            return result.rows
        })
}

module.exports = { fetchArticleById, fetchArticle }