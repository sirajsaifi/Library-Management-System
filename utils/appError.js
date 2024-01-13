class AppError extends Error {  //Error is built-in
    constructor(message, statusCode) {
        super(message)  //to call parent constructor...message is only parameter that built-in errors accept

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error'
        this.isOperational = true   //a user creating a tour without the rewuired fields is called Operational Errors

        Error.captureStackTrace(this, this.constructor) //Stack Trace show us where the error happened in terminal
    }
}

module.exports = AppError