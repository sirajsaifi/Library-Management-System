const AppError = require('../utils/appError')


const handleCastErrorDB = err => {  //trying an invalid id for get booklike wwwwwwwwwwwwww
    const message = `Invlaid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}


// show error for the fields that are supposed to be unique which are given in Model file
const handleDuplicateFieldsDB = err => {    //creating a tour with existing tour name
    const value = Object.keys(err.keyValue)[0]
    console.log(value)

    const message = `Duplicate value for field ${value}: ${err.keyValue[value]}`
    return new AppError(message, 400)
}


const handleValidationErrorDB = err => {    //shows if a field has validation like min, max characater etc.
    const errors = Object.values(err.errors).map(el => el.message)  //getting values of all errors and looping over them through map

    const message = `Invalid input data. ${errors.join(' ')}`
    return new AppError(message, 400)
}


const handleJWTError = () => new AppError('Invalid token! Please login again', 401)

const handleJWTExpired = () => new AppError('Your token has expired. Please login again', 401)

const sendErrorDev = (err, req, res) => {
    //A) API
    if (req.originalUrl.startsWith('/api')) {   //originalUrl is the entire url but not with the host 
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }

    //B) Rendered Website
    console.error('Error', err)
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
    })
}

const sendErrorProd = (err, req, res) => {
    //A) API
    if (req.originalUrl.startsWith('/api')) {
        //A) Operational Error: trusted errors..send to clients
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }

        //B) Programming or unknown errors, don't leak error details to client
        //1) log the error so we developers can see the error
        console.error('Error', err)

        //2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }

    //B) Rendered website
    //A) Operational error: trusted errors..send to clients
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        })
    }
    //B) Programming or unknown errors, don't leak error details to client
    //1) log the error so we developers can see it
    console.error('Error', err)

    //2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later'
    })
}


//error handling middleware function
module.exports = (err, req, res, next) => {
    // console.log(err.stack)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    }

    else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.message = err.message

        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTExpired()

        sendErrorProd(error, req, res)
    }
}