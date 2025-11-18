const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide username, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
        message: userExists.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user (password hashing is handled by the User model middleware)
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data and token (excluding password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    // Pass errors to error handler middleware
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data and token (excluding password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    // Pass errors to error handler middleware
    next(error);
  }
};

module.exports = { register, login };