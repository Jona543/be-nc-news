const db = require("../db/connection")

const removeComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id])
}

module.exports = { removeComment }