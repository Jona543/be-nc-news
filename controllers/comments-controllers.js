const { removeComment } = require("../models/comments-models")

const deleteComment = (request, response) => {

    const { comment_id } = request.params
    removeComment(comment_id).then(() => {
        response.status(204).send()
    })
}

module.exports = { deleteComment }