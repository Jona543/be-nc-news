const db = require("../db/connection")

const fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, message: "Article Not Found"})
        }
        return rows[0]
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

const fetchCommentsByArticle = (article_id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments
        JOIN articles
        ON comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY created_at`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { fetchArticleById, fetchArticle, fetchCommentsByArticle }