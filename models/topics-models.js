const db = require("../db/connection")

const fetchTopics = () => {
    const string = `SELECT * FROM topics`
    return db.query(string).then((result) => {
        return result
    })
}

module.exports = fetchTopics