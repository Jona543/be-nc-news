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

const fetchArticle = (userQuery) => {
    const sort_by = userQuery.sort_by || "created_at"
    const order = userQuery.order || "desc"
    const allowedInputs = ['title', 'topic', 'author', 'body', 'created_at', 'votes']
    if (order !== "desc" && order !== "asc"){
        return Promise.reject({status:404, message: "Invalid Order Query"})
    }
    if (!allowedInputs.includes(sort_by)){
        return Promise.reject({status: 404, message: "Invalid Input"})
    }

    let queryString = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT OUTER JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`

    return db.query(queryString)
        .then(({rows}) => {
            return rows
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

const insertComment = (article_id, username, body) => {
    return db.query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *', [article_id, username, body])
    .then(({rows}) => {
        return rows[0]
    })
}
const editVotesByArticle = (article_id, body) => {

    return fetchArticleById(article_id).then(() => {
        return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [body.inc_votes, article_id])
        .then(({rows}) => {
            return rows[0]
        })
    })
}

module.exports = { fetchArticleById, fetchArticle, fetchCommentsByArticle, insertComment, editVotesByArticle }