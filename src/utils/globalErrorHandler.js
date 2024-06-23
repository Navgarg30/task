const HttpStatusCodes = require("./httpStatusCode.js");
const appError = require("./appError.js");
const sendErrorDev = (err, req, res) => {
    err.statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stackTrack: err.stack
    })
}
const sendErrorProd = (err, req, res) => {
    if(err.isOperational){
        err.statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,

        })   
    }
    else{
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Oops, something went wrong!'

        })  
    }
}


const globalErrorHandler = (err, req, res, next) => {
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res)
    }
    else if(process.env.NODE_ENV === 'production'){
        if(err.name === 'CastError') err=handleCastError(err);

        sendErrorProd(err, req, res)
    }
    else{
        res.status(err.statusCode).json({ 
            status: err.status,
            message: err.message
        })
    }
}
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError(message, HttpStatusCodes.BAD_REQUEST);
}
module.exports = globalErrorHandler;