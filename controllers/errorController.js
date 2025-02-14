const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateValueDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  // console.log(value);
  const message = `Name ${value} is already taken, Try Different name`;
  return new AppError(message, 404);
};

const hanldeValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  message = `Invalid Input Data ${errors.join('. ')}`;
  return new AppError(message, 404);
};

const sendErrorDev = (req, res, err) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // B) Rendered Website
  // console.log('Error💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrongg',
    msg: err.message,
  });
};
const sendErrorProd = (req, res, err) => {
  // for API
  if (req.originalUrl.startsWith('/api')) {
    // console.log(err.isOperational);
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!!',
    });
  }
  // Rendered Website
  if (err.isOperational) {
    // console.log(err.status);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrongg',
      msg: err.message,
    });
  }
  console.log('Error💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrongg',
    msg: 'Please try again later',
  });
};

const handleJWTError = (err) => new AppError('Please log in again!', 401);

const handleJWTExpire = (err) =>
  new AppError('Your Token has been expired', 401);

// production side error messages
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(req, res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    error.message = err.message;
    // error.message = error.message;
    // console.log(error.code);
    // console.log(error.name);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateValueDB(error);
    if (error.name === 'ValidationError')
      error = hanldeValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpire(error);
    sendErrorProd(req, res, error);
  }
};
