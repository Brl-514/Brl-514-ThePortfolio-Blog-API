const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes by verifying JWT token
const protect = async (req, res, next) => {
  let token;

  try {
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
        message: 'Authentication token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from the token payload
    req.user = await User.findById(decoded.id);

    // Check if user still exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists',
        message: 'Authentication failed'
      });
    }

    // Continue to the route handler
    next();
  } catch (error) {
    // Handle token errors
    let errorMessage = 'Not authorized to access this route';
    let errorType = 'authentication_error';

    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
      errorType = 'invalid_token';
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
      errorType = 'expired_token';
    }

    return res.status(401).json({
      success: false,
      error: errorMessage,
      message: errorType,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { protect };