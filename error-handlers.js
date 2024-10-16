exports.psqlErrorHandler = (err, request, response, next) => {
    if (err.code === '22P02'){
        response.status(400).send({ message: "Invalid Id Type"})
    } else if (err.code === '23503'){
        response.status(404).send({message: "Article Not Found"})
    } else if (err.code === '23502'){
        response.status(400).send({message: "Missing Information"})
    } else {
    next(err)   
    }
}

exports.customErrorHandler = (err, request, response, next) => {
    if (err.status && err.message){
        response.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}