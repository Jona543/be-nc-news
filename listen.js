const app = require("./app.js")
const { PORT = 8070 } = process.env

app.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`listening on ${PORT}`)
    }
})