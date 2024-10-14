const app = require("./app")

app.listen(8070, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('listening on 8070')
    }
})