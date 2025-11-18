// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Set default error status and message
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  
  // Custom error handling for different error types
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    message = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400; // Bad Request
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 400; // Bad Request
    message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401; // Unauthorized
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401; // Unauthorized
    message = 'Token expired';
  }
  
  // Return consistent JSON error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      // Only include stack trace in development environment
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    }
  });
};

module.exports = errorHandler;