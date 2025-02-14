class AppError extends Error {
  constructor(message, statusCode) {
    //this is parent call whateever we send form there will an error property to the inherited Error class
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
